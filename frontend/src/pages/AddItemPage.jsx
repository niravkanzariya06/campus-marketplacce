import { useForm } from "react-hook-form";
import productService from '../services/productService';
import { useSelector } from "react-redux";
import AtmosphericBlooms from '../Components/AtmosphericBlooms';
import { useState, useRef } from 'react';

const AddItem = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  const user = useSelector((state) => state.auth.userData);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState('Mint');
  const fileInputRef = useRef(null);

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setValue("image", e.target.files);
    }
  };

  const handleConditionSelect = (condition) => {
    setSelectedCondition(condition);
    setValue("condition", condition);
  };

  // -------------------
  // SUBMIT HANDLER
  // -------------------
  const onSubmit = async (data) => {
    try {
      // 1. Upload image
      const imageFile = data.image[0];

      const uploadedImage = await productService.uploadFile(imageFile);

      // ✅ FIX: return null instead of false, so check for null safely
      if (!uploadedImage || !uploadedImage.$id) {
        alert("Image upload failed!");
        return;
      }

      // SAFE IMAGE ID
      const imageID = uploadedImage.$id;

      // 2. Create product document
        const product = await productService.createProduct({
          title: data.title,
          price: Number(data.price),
          category: data.category,
          condition: data.condition || "",
          location: data.location || "",
          description: data.description,
          imageId: imageID,
          userId: user?.$id,
          sellerName: user.name || user.email.split("@")[0],
          // No need to set status/listing_status - backend sets: status='pending', listing_status='active'
      });

      if (product) {
        alert("✅ Product listed successfully! It will appear in Browse section.");
        reset();
      } else {
        alert("❌ Error creating product. Please try again.");
      }

    } catch (error) {
      console.error("Error submitting product:", error);
      alert("❌ Failed to list product. Please check your internet connection and try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-start relative py-10">
      <AtmosphericBlooms intensity="vibrant" />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-headline tracking-tight">
            Lumina Campus
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-headline" href="#">Marketplace</a>
            <a className="text-on-surface-variant font-medium hover:text-on-surface transition-colors font-headline" href="#">My Listings</a>
            <a className="text-indigo-400 font-bold border-b-2 border-indigo-500 pb-1 font-headline" href="#">Sell</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors" data-icon="notifications">notifications</span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors" data-icon="shopping_cart">shopping_cart</span>
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 p-0.5">
              <img className="w-full h-full rounded-full object-cover" data-alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAYTs990lm0QG4iRfJEUOFDINzOEAEnqJ_OdZ4icBJ_EnpPm0YmHSEPXjrvI2tx0Y87Rd7NiXiEpArsj4lx8N_hiwcsWZokYX297XF5cSbMV2vNwGEd6uPuwfOiUVE1DZy_oeIKvXas3ueuJ02adlV862aXJJSaMk59NaBDDDRmfZhS55crwgubjLO-kJaT9VSeHok4__O1BjpRd72BiFyPIhWuMvHA20GnfaDs9puvyUBtDSgATqWucaMUGulyRpV5_ejGQtww0EZ" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 text-center relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-headline tracking-tighter mb-4">
            List Your Gear
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-lg">
            Turn your unused tech and campus essentials into credit. Simple, secure, and exclusive to students.
          </p>
        </header>

        {/* Multi-Step Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-0">
              {/* Step 1 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)] z-10">1</div>
                  <span className="font-headline font-bold text-indigo-400">Photos</span>
                </div>
                <div className="w-[2px] h-48 bg-gradient-to-b from-indigo-500/50 to-slate-700 ml-[19px] -my-1 shadow-[0_0_15px_rgba(99,102,241,0.2)]"></div>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest/50 text-on-surface-variant flex items-center justify-center font-bold border border-outline-variant z-10">2</div>
                  <span className="font-headline font-semibold text-on-surface-variant">Details</span>
                </div>
                <div className="w-[2px] h-[550px] bg-outline-variant/50 ml-[19px] -my-1"></div>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest/50 text-on-surface-variant flex items-center justify-center font-bold border border-outline-variant z-10">3</div>
                  <span className="font-headline font-semibold text-on-surface-variant">Pricing</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-9 space-y-8">
            {/* Section 1: Photo Upload */}
            <div className="bg-surface-container/30 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 border border-outline-variant/50 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-400 text-3xl" data-icon="add_a_photo">add_a_photo</span>
                  <h2 className="text-2xl font-bold font-headline text-on-surface">Product Image</h2>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Mandatory</span>
              </div>
              <div className="relative group h-48 sm:h-64 w-full rounded-2xl border-2 border-dashed border-outline-variant hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all overflow-hidden cursor-pointer">
                {imagePreview ? (
                  // Image Preview State
                  <div className="relative inset-0">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-500 text-on-surface flex items-center justify-center transition-all"
                    >
                      <span className="material-symbols-outlined text-lg" data-icon="close">close</span>
                    </button>
                  </div>
                ) : (
                  // Placeholder State
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-surface-container-highest/50 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 border border-outline-variant">
                      <span className="material-symbols-outlined text-3xl text-indigo-400" data-icon="upload_file">upload_file</span>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-on-surface">Upload Product Image</p>
                      <p className="text-sm text-on-surface-variant">PNG, JPG or WebP up to 10MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-6 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-sm font-bold hover:bg-indigo-500/10 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                  type="file"
                  {...register("image", { required: "Product image is required" })}
                  onChange={handleImageChange}
                />
              </div>
              {errors.image && (
                <p className="text-sm text-red-400 mt-2">
                  {errors.image.message}
                </p>
              )}
              <p className="mt-4 text-xs text-slate-500 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm" data-icon="info">info</span>
                At least one high-quality clear photo of the actual item is required.
              </p>
            </div>

            {/* Section 2: Item Details */}
            <div className="bg-surface-container/30 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 border border-outline-variant/50">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-pink-400 text-3xl" data-icon="description">description</span>
                <h2 className="text-2xl font-bold font-headline text-on-surface">Tell the Story</h2>
              </div>
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 ml-1">Title</label>
                  <input
                    placeholder="e.g. MacBook Pro M2 - Space Gray"
                    {...register("title", { required: "Product name is required" })}
                    className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-indigo-500 transition-all rounded-t-xl px-4 py-4 text-on-surface placeholder:text-slate-500"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 ml-1">Category</label>
                    <select
                      {...register("category", { required: "Category is required" })}
                      className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-indigo-500 transition-all rounded-t-xl px-4 py-4 text-on-surface appearance-none"
                    >
                      <option value="" className="text-gray-900">Select category</option>
                      <option value="electronics" className="text-gray-900">Electronics</option>
                      <option value="textbooks" className="text-gray-900">Textbooks</option>
                      <option value="furniture" className="text-gray-900">Furniture</option>
                      <option value="appliances" className="text-gray-900">Appliances</option>
                    </select>
                    {errors.category && (
                      <p className="text-sm text-red-400 mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 ml-1">Brand</label>
                    <input
                      placeholder="Optional"
                      {...register("brand")}
                      className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-indigo-500 transition-all rounded-t-xl px-4 py-4 text-on-surface placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 ml-1">Location</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" data-icon="location_on">location_on</span>
                    <input
                      placeholder="e.g. Student Union, Library, or North Campus"
                      {...register("location")}
                      className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-indigo-500 transition-all rounded-t-xl pl-12 pr-4 py-4 text-on-surface placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300 ml-1">Description</label>
                  <textarea
                    placeholder="Describe the specs, usage history, and any minor flaws..."
                    rows="4"
                    {...register("description", { required: "Description is required" })}
                    className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-indigo-500 transition-all rounded-t-xl px-4 py-4 text-on-surface placeholder:text-slate-500 resize-none"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Pricing & Condition */}
            <div className="bg-surface-container/30 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 border border-outline-variant/50">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-cyan-400 text-3xl" data-icon="payments">payments</span>
                <h2 className="text-2xl font-bold font-headline text-on-surface">Value & Quality</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Price */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 ml-1">Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        {...register("price", {
                          required: "Price is required",
                          min: { value: 1, message: "Price must be greater than 0" },
                        })}
                        className="w-full bg-surface-container-highest/50 border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-indigo-500 transition-all rounded-t-xl pl-8 pr-4 py-4 text-2xl font-bold font-headline text-on-surface"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-400 mt-1">
                        {errors.price.message}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2 italic">Average price for similar items: $850.00</p>
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-300 ml-1">Condition</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mint', 'Excellent', 'Good', 'Fair'].map((cond) => (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => handleConditionSelect(cond)}
                        className={`px-5 py-2 rounded-full font-bold text-sm border transition-all ${
                          selectedCondition === cond
                            ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:scale-105'
                            : 'bg-surface-container-highest/50 text-slate-300 border-outline-variant hover:border-pink-500/50'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" {...register("condition")} value={selectedCondition} />
                  <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 mt-4">
                    <p className="text-xs text-cyan-300 leading-relaxed">
                      <span className="font-bold">Mint:</span> Never used or in flawless condition. Includes all original packaging and accessories.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
              <button type="button" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors group">
                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1" data-icon="arrow_back">arrow_back</span>
                <span className="font-bold">Save as Draft</span>
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-on-surface font-black text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-indigo-400/20"
              >
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 pb-safe bg-surface/70 backdrop-blur-lg rounded-t-3xl border-t border-white/10 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-300 transition-transform" href="#">
          <span className="material-symbols-outlined" data-icon="explore">explore</span>
          <span className="font-['Manrope'] text-[10px] uppercase tracking-widest mt-1">Explore</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-300 transition-transform" href="#">
          <span className="material-symbols-outlined" data-icon="search">search</span>
          <span className="font-['Manrope'] text-[10px] uppercase tracking-widest mt-1">Search</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-indigo-500/10 text-indigo-400 rounded-xl px-3 py-1 scale-110 transition-transform duration-300" href="#">
          <span className="material-symbols-outlined" data-icon="add_circle" style={{fontVariationSettings: "'FILL' 1"}}>add_circle</span>
          <span className="font-['Manrope'] text-[10px] uppercase tracking-widest mt-1">Sell</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-300 transition-transform" href="#">
          <span className="material-symbols-outlined" data-icon="mail">mail</span>
          <span className="font-['Manrope'] text-[10px] uppercase tracking-widest mt-1">Inbox</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 hover:text-indigo-300 transition-transform" href="#">
          <span className="material-symbols-outlined" data-icon="person_outline">person_outline</span>
          <span className="font-['Manrope'] text-[10px] uppercase tracking-widest mt-1">Profile</span>
        </a>
      </nav>

      {/* Decorative Glow Elements */}
      <div className="fixed top-1/4 -right-24 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full -z-10"></div>
      <div className="fixed bottom-1/4 -left-24 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full -z-10"></div>
    </div>
  );
};

export default AddItem;
