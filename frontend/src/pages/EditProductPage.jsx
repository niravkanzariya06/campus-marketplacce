import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import productService from '../services/productService';
import { fetchProducts } from '../store/productSlice';
import { useEffect, useState } from "react";
import AtmosphericBlooms from '../Components/AtmosphericBlooms';
import { LUMINA_COLORS } from '../Components/Theme/ThemeProvider';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products);
  const product = products.find((p) => p.$id === id);

  const [newImageFile, setNewImageFile] = useState(null);

  const previewImage = newImageFile
    ? URL.createObjectURL(newImageFile)
    : (product ? productService.getFileView(product.imageId) : null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Pre-fill form fields
  useEffect(() => {
    if (product) {
      setValue("title", product.title);
      setValue("price", product.price);
      setValue("category", product.category);
      setValue("condition", product.condition);
      setValue("location", product.location);
      setValue("description", product.description);
    }
  }, [product, setValue]);

  if (!product) return <div className="min-h-screen flex items-center justify-center text-on-surface">Loading...</div>;

  // ---------------------------
  // SUBMIT EDITED PRODUCT
  // ---------------------------
  const onSubmit = async (data) => {
    try {
      let updatedImageId = product.imageId;

      // If user selected new image:
      if (newImageFile) {
        const uploaded = await productService.uploadFile(newImageFile);

        if (!uploaded || !uploaded.$id) {
          alert("Image upload failed");
          return;
        }

        updatedImageId = uploaded.$id;
      }

      // Update DB
      await productService.updateProduct(product.$id, {
        title: data.title,
        price: Number(data.price),
        category: data.category,
        condition: data.condition,
        location: data.location,
        description: data.description,
        imageId: updatedImageId,
      });

      dispatch(fetchProducts());

      alert("✅ Product updated successfully!");
      navigate(`/profile/product/${product.$id}`);
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("❌ Error updating product. Please try again.");
    }
  };

  // ---------------------------
  // IMAGE HANDLER
  // ---------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewImageFile(file);
  };

  return (
    <div className="min-h-screen w-full relative py-10" style={{ backgroundColor: LUMINA_COLORS.background }}>
      <AtmosphericBlooms intensity="vibrant" />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-8 pb-10">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
            Refine Your Listing
          </h1>
          <p className="dark:text-gray-400 text-gray-600 text-lg">
            Update details for <span className="text-indigo-400 font-bold">{product.title}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Media & Quick Actions */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            {/* Image Preview with 3D Tilt */}
            <div className="glass-panel rounded-3xl p-5 tilt-card overflow-hidden shadow-2xl">
              <div className="relative group rounded-2xl overflow-hidden aspect-square">
                <img
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={previewImage}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <label className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-bold text-on-surface hover:bg-white/20 transition-all border border-white/10 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    Change Cover Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Listing Vitality Stats */}
            <div className="glass-panel rounded-3xl p-6 space-y-4">
              <h3 className="font-headline font-bold text-lg text-indigo-400 flex items-center gap-2">
                <span className="material-symbols-outlined">analytics</span>
                Listing Vitality
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-xs dark:text-gray-400 text-gray-600 font-label uppercase tracking-widest">Views</span>
                  <span className="font-bold text-on-surface text-lg">1,248</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-xs dark:text-gray-400 text-gray-600 font-label uppercase tracking-widest">Inquiries</span>
                  <span className="font-bold text-on-surface text-lg">14</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-black/30 border border-white/5">
                  <span className="text-xs dark:text-gray-400 text-gray-600 font-label uppercase tracking-widest">Listed Since</span>
                  <span className="font-bold text-on-surface">Oct 12, 2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="glass-panel rounded-[2rem] p-4 sm:p-6 md:p-8 shadow-2xl shadow-indigo-500/5 space-y-6">
                {/* Listing Title */}
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-[0.2em] dark:text-gray-400 text-gray-600 ml-1">
                    Listing Title
                  </label>
                  <input
                    {...register("title", { required: "Product name is required" })}
                    defaultValue={product.title}
                    className="w-full lumina-input rounded-2xl px-6 py-4 text-on-surface font-headline font-bold focus:ring-0 shadow-inner transition-all"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-400 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="font-label text-xs uppercase tracking-[0.2em] dark:text-gray-400 text-gray-600 ml-1">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        {...register("category", { required: "Category is required" })}
                        defaultValue={product.category}
                        className="w-full lumina-input rounded-2xl px-6 py-4 text-on-surface font-bold focus:ring-0 shadow-inner appearance-none transition-all"
                      >
                        <option value="electronics">Electronics</option>
                        <option value="books">Books</option>
                        <option value="furniture">Furniture</option>
                        <option value="dorm-essentials">Dorm Essentials</option>
                        <option value="apparel">Apparel</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none dark:text-gray-400 text-gray-600">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Brand (Optional) */}
                  <div className="space-y-2">
                    <label className="font-label text-xs uppercase tracking-[0.2em] dark:text-gray-400 text-gray-600 ml-1">
                      Brand (Optional)
                    </label>
                    <input
                      {...register("brand")}
                      placeholder="e.g. Apple, Samsung, etc."
                      className="w-full lumina-input rounded-2xl px-6 py-4 text-on-surface font-bold focus:ring-0 shadow-inner transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="font-label text-xs uppercase tracking-[0.2em] dark:text-gray-400 text-gray-600 ml-1">
                      Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        {...register("price", {
                          required: "Price is required",
                          min: { value: 1, message: "Price must be greater than 0" },
                        })}
                        defaultValue={product.price}
                        className="w-full lumina-input rounded-2xl pl-10 pr-6 py-4 text-on-surface font-bold focus:ring-0 shadow-inner transition-all"
                      />
                      {errors.price && (
                        <p className="text-sm text-red-400 mt-1">{errors.price.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="space-y-2">
                    <label className="font-label text-xs uppercase tracking-[0.2em] dark:text-gray-400 text-gray-600 ml-1">
                      Condition
                    </label>
                    <div className="relative">
                      <select
                        {...register("condition")}
                        defaultValue={product.condition}
                        className="w-full lumina-input rounded-2xl px-6 py-4 text-on-surface font-bold focus:ring-0 shadow-inner appearance-none transition-all"
                      >
                        <option value="brand-new">Brand New</option>
                        <option value="like-new">Like New</option>
                        <option value="gently-used">Gently Used</option>
                        <option value="well-worn">Well Worn</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none dark:text-gray-400 text-gray-600">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-[0.2em] dark:text-gray-400 text-gray-600 ml-1">
                    Location
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 text-xl">
                      location_on
                    </span>
                    <input
                      {...register("location")}
                      defaultValue={product.location}
                      placeholder="e.g. Student Union, Library, or North Campus"
                      className="w-full lumina-input rounded-2xl pl-14 pr-6 py-4 text-on-surface font-medium focus:ring-0 shadow-inner transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="font-label text-xs uppercase tracking-[0.2em] dark:text-gray-400 text-gray-600 ml-1">
                    Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    defaultValue={product.description}
                    rows={6}
                    placeholder="Describe the specs, usage history, and any minor flaws..."
                    className="w-full lumina-input rounded-3xl px-6 py-4 text-on-surface text-sm leading-relaxed focus:ring-0 shadow-inner transition-all resize-none"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-400 mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-indigo-400">visibility</span>
                    <div>
                      <p className="font-bold text-sm text-on-surface">Active Listing</p>
                      <p className="text-xs dark:text-gray-400 text-gray-600">Visible to all verified students</p>
                    </div>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-indigo-500/30 cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all"></div>
                  </div>
                </div>

                {/* CTA Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-on-surface font-headline font-extrabold py-5 rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving…" : "Update Listing"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure? This action cannot be undone.")) {
                        // Handle delete
                        productService.deleteProduct(product.$id).then(() => {
                          dispatch(fetchProducts());
                          alert("Listing deleted successfully!");
                          navigate("/profile");
                        });
                      }
                    }}
                    className="flex-[0.5] flex items-center justify-center gap-2 border border-red-500/30 text-red-400 font-headline font-bold py-5 rounded-2xl hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] active:scale-95 transition-all duration-300 group"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-surface/70 backdrop-blur-lg rounded-t-3xl border-t border-white/10 z-50 flex justify-around items-center px-4 py-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-300 transition-transform">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest mt-1">Explore</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-300 transition-transform">
          <span className="material-symbols-outlined">search</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-indigo-500/10 text-indigo-400 rounded-xl px-3 py-1">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest mt-1">Sell</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-300 transition-transform">
          <span className="material-symbols-outlined">mail</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest mt-1">Inbox</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-500 hover:text-indigo-300 transition-transform">
          <span className="material-symbols-outlined">person_outline</span>
          <span className="font-manrope text-[10px] uppercase tracking-widest mt-1">Profile</span>
        </div>
      </nav>
    </div>
  );
};

export default EditProduct;
