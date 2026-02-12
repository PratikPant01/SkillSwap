'use client';
import {useState} from "react";
import { CheckCircle,ImageIcon,X} from "lucide-react";
export default function CreatePostPage() {
    const [postType,setPostType] = useState("paid");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");
    const [imagePreview,setImagePreview] = useState("");
    const [images, setImages] = useState<string[]>([]);


 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [];

        Array.from(files).forEach(file => {
            const previewUrl = URL.createObjectURL(file);
            newImages.push(previewUrl);
        });

        setImages(prev => {
            const combined = [...prev, ...newImages];
            return combined.slice(0,4); // max 4 images
        });
    };

    const removeImage = (index:number) => {
        setImages(prev => prev.filter((_,i) => i !== index));
    };

    const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
     };

  const removeTag = (tagToRemove:string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  return (
    <div className="min-h-screen bg-gray-200">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white pt-28 pb-5">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <h1 className="text-4xl font-bold mb-4 text-center">
                    Create a New Service Post
                </h1>
                <p className="text-center text-blue-200 mb-10">
                    Share your skills and services with the community. Fill out the form below to get started.
                </p>
            </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
            <form className="space-y-6">
                {/* POST TYPE SELECTION */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Post Type</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Paid Service */}
                    <button
                    type="button"
                    onClick={() => setPostType("paid")}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                        postType === "paid"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    >
                    <h3 className="font-semibold text-gray-900 mb-1">
                        Paid Service
                    </h3>
                    <p className="text-sm text-gray-600">
                        Offer professional services, set your price, and earn profit from your skills.
                    </p>
                    </button>

                    {/* Free Service */}
                    <button
                    type="button"
                    onClick={() => setPostType("free")}
                    className={`p-5 rounded-xl border-2 transition-all text-left ${
                        postType === "free"
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    >
                    <h3 className="font-semibold text-gray-900 mb-1">
                        Free / Portfolio
                    </h3>
                    <p className="text-sm text-gray-600">
                        Provide free work to build your portfolio, gain experience, and improve profile ratings.
                    </p>
                    </button>

                </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Service Information</h2>
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Service Title<span className="text-red-600">*</span></label>
                        <input className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="I will make a modern website UI..." required/>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Category <span className="text-red-500">*</span>
                        </label>
                        <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        >
                        <option value="">Select a category</option>
                        <option value="design">Design</option>
                        <option value="development">Development</option>
                        <option value="video">Video & Animation</option>
                        <option value="writing">Writing</option>
                        <option value="marketing">Marketing</option>
                        <option value="audio">Music & Audio</option>
                        <option value="photography">Photography</option>
                        </select>
                    </div>

                    {/* Price - Only show for paid posts */}
                    {postType === "paid" && (
                        <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Price (Rs) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="1500"
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        </div>
                
                    )}

                    {postType === "free" && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 mb-2"/>
                            <p className="text-green-700">You have selected to create a free service post.<br/> This is a great way to build your portfolio and gain experience. You can always upgrade to a paid post later!</p>
                        </div>
                        )}

                    {/* Image Upload Wala Part */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Service Images <span className="text-red-500">*</span>
                        </label>

                        <p className="text-sm text-gray-500 mb-3">
                            Upload up to 4 images. First image is required and will be used as main preview.
                        </p>

                        {/* Styled Upload Box */}
                        <label className="cursor-pointer">

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                required={images.length === 0}
                            />

                            <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition">
                                <ImageIcon size={28}/>
                                <span className="mt-2 font-medium">
                                    Click to upload images
                                </span>
                                <span className="text-xs text-gray-400 mt-1">
                                    Max 4 images • JPG, PNG supported
                                </span>
                            </div>
                        </label>

                        {/* Image Preview Grid */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            {images.length > 0 ? (
                                images.map((img,index)=>(
                                    <div key={index} className="relative inline-block">
                                        <img
                                            src={img}
                                            className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                                        />

                                        <button
                                            type="button"
                                            onClick={()=>removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                                        >
                                            <X size={14}/>
                                        </button>

                                        {index===0 && (
                                            <span className="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                                                Main
                                            </span>
                                        )}
                                    </div>
                                ))
                            ):(
                                <div className="w-48 h-32 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
                                    <ImageIcon size={24}/>
                                    <span className="text-xs mt-1">Preview</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
                </div>

                {/* Service Description*/}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Service Description</h2>
                            
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Describe your service in detail..."
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            required
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Be clear and detailed about what you're offering
                        </p>
                    </div>
                </div>

                {/* DELIVERY DETAILS */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>
            
            <div className="space-y-5">
              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Delivery Time <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select delivery time</option>
                  <option value="1">1 day</option>
                  <option value="2-3">2-3 days</option>
                  <option value="1week">1 week</option>
                  <option value="custom">2 week - 1 month</option>
                </select>
              </div>

              {/* Revisions Allowed */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Revisions Allowed <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="5"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Kathmandu, Nepal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            </div>

                {/* SECTION 4 - TAGS */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Optional Details</h2>

                {/* Tags Input */}
                <div className="flex gap-2 mb-3">
                    <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                        }
                    }}
                    placeholder="Add a tag (e.g., UI Design, React)"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                    Add
                    </button>
                </div>

                {/* Tags Display */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, idx) => (
                        <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-1 border border-blue-200"
                        >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-900 transition"
                        >
                            <X size={14} className="hover:text-blue-300" />
                        </button>
                        </span>
                    ))}
                    </div>
                )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        type="button"
                        className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Publish Service
                    </button>
                    </div>
                </div>
                            
            </form>
        </div>
    </div>

    
    );
}