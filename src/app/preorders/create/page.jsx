"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Select, ListBox, Spinner } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { createPreorderAction } from "@/lib/actions/preorders";

export default function CreatePreorderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    products: 1,
    preorderWhen: "regardless-of-stock",
    startsAt: "",
    endsAt: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      const result = await createPreorderAction(formDataObj);
      if (result.success) {
        router.push("/preorders");
        router.refresh();
      } else {
        console.error("Error creating preorder:", result.error);
      }
    } catch (error) {
      console.error("Error creating preorder:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50/30 to-white p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-sky-100/40 border border-sky-100/40 p-6 md:p-8">
          {/* Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/preorders"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Preorder</h1>
          <p className="text-sm text-gray-500 mb-6">These values appear in the preorders list.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="A label to recognize this preorder by."
                  required
                  className="w-full"
                  classNames={{
                    inputWrapper: "bg-white/70 border border-sky-200/50 rounded-lg focus-within:border-sky-500",
                  }}
                />
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Products
                </label>
                <Input
                  type="number"
                  name="products"
                  value={formData.products}
                  onChange={handleChange}
                  min="1"
                  placeholder="Number of products covered by this preorder."
                  className="w-full"
                  classNames={{
                    inputWrapper: "bg-white/70 border border-sky-200/50 rounded-lg focus-within:border-sky-500",
                  }}
                />
              </div>

              {/* Preorder when */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preorder when
                </label>
                <Select
                  value={formData.preorderWhen}
                  onChange={(value) => setFormData((prev) => ({ ...prev, preorderWhen: value }))}
                  className="w-full"
                >
                  <Select.Trigger className="bg-white/70 border border-sky-200/50 rounded-lg h-10 text-sm text-gray-700">
                    <Select.Value placeholder="When customers are allowed to preorder." />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="regardless-of-stock" textValue="Regardless of stock">
                        Regardless of stock
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="out-of-stock" textValue="Out of stock">
                        Out of stock
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
              </div>

              {/* Starts at */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Starts at <span className="text-red-500">*</span>
                </label>
                <Input
                  type="datetime-local"
                  name="startsAt"
                  value={formData.startsAt}
                  onChange={handleChange}
                  required
                  className="w-full"
                  classNames={{
                    inputWrapper: "bg-white/70 border border-sky-200/50 rounded-lg focus-within:border-sky-500",
                  }}
                />
              </div>

              {/* Ends at */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ends at
                </label>
                <Input
                  type="datetime-local"
                  name="endsAt"
                  value={formData.endsAt}
                  onChange={handleChange}
                  className="w-full"
                  classNames={{
                    inputWrapper: "bg-white/70 border border-sky-200/50 rounded-lg focus-within:border-sky-500",
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for no end date.</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  className="w-full"
                >
                  <Select.Trigger className="bg-white/70 border border-sky-200/50 rounded-lg h-10 text-sm text-gray-700">
                    <Select.Value placeholder="Select status" />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="active" textValue="Active">
                        Active
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                      <ListBox.Item id="inactive" textValue="Inactive">
                        Inactive
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Active preorders are visible to customers.</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onPress={() => router.push("/preorders")}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/30"
                spinner={<Spinner color="white" size="sm" />}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}