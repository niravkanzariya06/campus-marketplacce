import postgres from "postgres";

let sql;

const connectToDatabase = async () => {
    try {
        sql = postgres(process.env.DATABASE_URL, {
            ssl: 'require',
            max: 10,
            prepare: true,
            idle_timeout: 30,        // close idle connections after 30s
            connect_timeout: 10,     // fail if connection takes >10s
        });

        // ===============================
        // USERS TABLE
        // ===============================
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL unique,
                password text NOT NULL,
                role VARCHAR(255) NOT NULL DEFAULT 'user',
                avatar text,
                avatar_public_id text,
                refresh_token text,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            )
        `;
        // ===============================
        // EMAIL VERIFICATION COLUMNS
        // ===============================
        await sql`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
            ADD COLUMN IF NOT EXISTS verification_token_expiry TIMESTAMP
        `;

        // ===============================
        // GOOGLE OAUTH COLUMNS
        // ===============================
        await sql`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255),
            ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local'
        `;

        // Mark existing users as verified so they aren't locked out
        await sql`UPDATE users SET is_verified = true WHERE is_verified = false`;

        await sql`CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token)`;

        // ===============================
        // OTPS TABLE (password reset)
        // ===============================
        await sql`
            CREATE TABLE IF NOT EXISTS otps (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                email VARCHAR(255) NOT NULL,
                otp VARCHAR(6),
                reset_token VARCHAR(255),
                reset_token_expiry TIMESTAMP,
                purpose VARCHAR(50) NOT NULL,
                expiry TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`CREATE INDEX IF NOT EXISTS idx_otps_email ON otps(email)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_otps_user_id ON otps(user_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_otps_reset_token ON otps(reset_token)`;

        // ===============================
        // PRODUCTS TABLE
        // ===============================
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                condition VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                description TEXT,
                status VARCHAR(255) NOT NULL, -- Admin: pending, approved, rejected
                listing_status VARCHAR(255) NOT NULL DEFAULT 'active', -- Seller: active, sold, archived
                user_id INTEGER REFERENCES users(id),
                image_url TEXT,
                image_public_id TEXT,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Add listing_status column if it doesn't exist (migration for existing DB)
        try {
            await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS listing_status VARCHAR(255) NOT NULL DEFAULT 'active'`;
        } catch (error) {
            // Column might already exist, ignore
        }
        // ===============================
        // CHATS TABLE (1-1 CHAT)
        // ===============================
        await sql`
        CREATE TABLE IF NOT EXISTS chats (
            id SERIAL PRIMARY KEY,
            user1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            user2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

        // ===============================
        // MESSAGES TABLE
        // ===============================
        await sql`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            content TEXT NOT NULL,
            chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
            sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        // ===============================
        // FAVORITES TABLE
        // ===============================
        await sql`
        CREATE TABLE IF NOT EXISTS favorites (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

        // ===============================
        // FEEDBACK TABLE
        // ===============================
        await sql`
        CREATE TABLE IF NOT EXISTS feedback (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            message TEXT NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

        // Add updated_at column if it doesn't exist (migration for existing DB)
        try {
            await sql`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'new'`;
            await sql`ALTER TABLE feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
        } catch (error) {
            // Columns might already exist, ignore
        }

        // ===============================
        // REPORTS TABLE
        // ===============================
        await sql`
        CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
            reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            reason VARCHAR(50) NOT NULL,
            message TEXT,
            status VARCHAR(50) NOT NULL DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

        // ===============================
        // PERFORMANCE INDEXES
        // ===============================
        // Products: most queries filter by status + listing_status
        await sql`CREATE INDEX IF NOT EXISTS idx_products_status_listing ON products(status, listing_status, created_at DESC)`;
        // Products: user's own products
        await sql`CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id)`;
        // Chats: lookup by participants
        await sql`CREATE INDEX IF NOT EXISTS idx_chats_user1 ON chats(user1_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_chats_user2 ON chats(user2_id)`;
        // Messages: ordered by chat
        await sql`CREATE INDEX IF NOT EXISTS idx_messages_chat_created ON messages(chat_id, created_at)`;
        // Favorites: prevent duplicates + fast lookup
        await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_user_product ON favorites(user_id, product_id)`;

        console.log("✅ Successfully connected to the database.");
    } catch (error) {
        console.error("❌ Error connecting to the database:", error);
    }
};

export { connectToDatabase, sql };