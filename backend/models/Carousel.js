import mongoose from "mongoose";
const carouselSchema = mongoose.Schema(
  {
    image: {
      type: String, // data: Buffer, contentType: String,
      required: true,
    },
    text: {
      type: String,
      default:"",
      required: true,
    },
    description: {
      type: String,
      default:"",
      required: true,
    }
  },
  { timestamps: true }
);
const Carousel = mongoose.model("Carousel", productSchema);
export default Carousel;
