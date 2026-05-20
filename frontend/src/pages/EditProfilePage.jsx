import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { updateProfilePhoto, login as authLogin } from '../store/authSlice';
import { useNavigate } from "react-router-dom";
import profileService from '../services/profileService';

const EditProfile = () => {
  const user = useSelector((state) => state.auth.userData);
  const profilePhoto = useSelector((state) => state.auth.profilePhoto);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name,
    },
  });

  const [preview, setPreview] = useState(profilePhoto);
  const [imageFile, setImageFile] = useState(null);

  if (!user) return <p>Loading...</p>;

  // -------------------------
  // Handle Image Preview
  // -------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // -------------------------
  // Submit Handler
  // -------------------------
  const onSubmit = async (data) => {
    try {
      let finalPhoto = profilePhoto;

      // 1. Upload new photo if selected
      if (imageFile) {
        const uploaded = await profileService.uploadProfilePhoto(user.$id, imageFile);


        if (uploaded) {
          finalPhoto = profileService.getProfilePhoto(uploaded.avatar || uploaded);
        }
      }

      // 2. Update name in appwrite prefs
      await profileService.updateName(data.name);

      // 3. Update Redux
      dispatch(
        authLogin({
          userData: { ...user, name: data.name },
          profilePhoto: finalPhoto,
        })
      );
      dispatch(updateProfilePhoto(finalPhoto));

      alert("✅ Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("❌ Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative py-10">
      <div className="w-[95%] max-w-2xl section-spacing">
        <h1 className="font-section-headline gradient-headline text-center mb-10">Edit Profile</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass glass-intense rounded-2xl p-8 space-y-6 border border-subtle shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT — Profile Photo */}
            <div className="space-y-5">
              <label className="block text-sm font-medium dark:text-gray-300">Profile Photo</label>
              <div className="relative w-full aspect-square rounded-xl overflow-hidden glass border border-subtle">
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium dark:text-gray-300 mb-2">Upload New Photo</label>
                <div className="upload-zone rounded-xl p-4 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    onChange={handleImageChange}
                    className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <p className="dark:text-gray-400 text-sm">Click to upload image</p>
                </div>
              </div>
            </div>

            {/* RIGHT — Name & Email */}
            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-2">Display Name</label>
                <input
                  placeholder="Your Name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full glass rounded-lg px-4 py-3 outline-none focus-glow-indigo transition-all duration-300 text-on-surface placeholder:text-outline"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-2">Email (cannot be changed)</label>
                <input
                  value={user.email}
                  disabled
                  className="w-full glass rounded-lg px-4 py-3 dark:text-gray-400 opacity-60 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-2.5 glass rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 btn-gradient-primary rounded-lg font-semibold shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "Saving…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;
