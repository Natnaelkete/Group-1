import React, { useState, ChangeEvent } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Label = LabelPrimitive.Root;

const PostProduct: React.FC = () => {
  const { t } = useTranslation();

  const [product, setProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product:", product);
    console.log("Image File:", imageFile);
    alert(t("postProduct.postButton") + " " + t("postProduct.title"));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 p-6">
      <Card className="w-full max-w-2xl shadow-xl rounded-3xl border-2 border-green-300 bg-white">
        <CardHeader className="border-b px-6 py-5">
          <CardTitle className="text-3xl font-extrabold text-green-900 tracking-wide">
            {t("postProduct.title")}
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <CardContent className="px-6 py-8">
            {/* Name, Quantity, and Price side by side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Label
                  htmlFor="name"
                  className="block mb-2 text-lg font-semibold text-green-800"
                >
                  {t("postProduct.productName")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t("postProduct.productName")}
                  value={product.name}
                  onChange={handleChange}
                  required
                  className="text-base"
                  autoComplete="off"
                />
              </div>

              <div>
                <Label
                  htmlFor="quantity"
                  className="block mb-2 text-lg font-semibold text-green-800"
                >
                  {t("postProduct.quantity")}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  name="quantity"
                  placeholder={t("postProduct.quantityPlaceholder")}
                  value={product.quantity}
                  onChange={handleChange}
                  required
                  min={0}
                  className="text-base"
                  autoComplete="off"
                />
              </div>

              <div>
                <Label
                  htmlFor="price"
                  className="block mb-2 text-lg font-semibold text-green-800"
                >
                  {t("postProduct.price")}
                </Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  placeholder={t("postProduct.pricePlaceholder")}
                  value={product.price}
                  onChange={handleChange}
                  required
                  min={0}
                  step="0.01"
                  className="text-base"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <Label
                htmlFor="description"
                className="block mb-2 text-lg font-semibold text-green-800"
              >
                {t("postProduct.description")}
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("postProduct.description")}
                value={product.description}
                onChange={handleChange}
                required
                rows={5}
                className="text-base resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <Label
                htmlFor="image"
                className="block mb-2 text-lg font-semibold text-green-800"
              >
                {t("postProduct.uploadImage")}
              </Label>
              <Input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="text-base"
              />
              {imagePreview && (
                <div className="mt-4 border rounded-2xl p-3 bg-green-100 border-green-300 shadow-inner">
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    className="w-full max-h-64 object-contain rounded-xl"
                  />
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end px-6 py-4 border-t border-green-300">
            <Button
              type="submit"
              className="text-lg font-semibold px-8 py-3 bg-green-700 text-white rounded-xl shadow-lg hover:bg-green-800 transition-colors"
            >
              {t("postProduct.postButton")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PostProduct;
