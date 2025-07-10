import React, { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";

const reasonOptions = [
  "Defective/Damaged",
  "Wrong size/color",
  "Not as described",
  "Changed mind",
  "Received wrong item",
  "Other",
];

const conditionOptions = [
  "Unopened/New",
  "Used - Excellent condition",
  "Used - Good condition",
  "Damaged/Defective",
];

export function Step3ReturnDetails({
  selectedItems,
  onNext,
  onBack,
}: {
  selectedItems: any[];
  onNext: (details: any) => void;
  onBack: () => void;
}) {
  const [reasons, setReasons] = useState<{ [itemId: string]: string }>({});
  const [otherReasons, setOtherReasons] = useState<{
    [itemId: string]: string;
  }>({});
  const [conditions, setConditions] = useState<{ [itemId: string]: string }>(
    {}
  );
  const [photos, setPhotos] = useState<{ [itemId: string]: File[] }>({});

  // Mock photo upload handler
  const handlePhotoUpload = (itemId: string, files: FileList | null) => {
    if (!files) return;
    setPhotos((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), ...Array.from(files)],
    }));
  };

  const isValid = selectedItems.every(
    (item) =>
      reasons[item.id] &&
      (reasons[item.id] !== "Other" || otherReasons[item.id]) &&
      conditions[item.id]
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Return Details</h2>
      <div className="space-y-6">
        {selectedItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4 border">
            <div className="flex gap-4 items-center mb-2">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-gray-500">
                  Variant: {item.variant}
                </div>
                <div className="text-xs text-gray-500">
                  ${item.price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Reason for return
              </label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={reasons[item.id] || ""}
                onChange={(e) =>
                  setReasons((prev) => ({ ...prev, [item.id]: e.target.value }))
                }
              >
                <option value="">Select reason</option>
                {reasonOptions.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {reasons[item.id] === "Other" && (
                <input
                  className="border rounded px-3 py-2 w-full mt-2"
                  placeholder="Please specify"
                  value={otherReasons[item.id] || ""}
                  onChange={(e) =>
                    setOtherReasons((prev) => ({
                      ...prev,
                      [item.id]: e.target.value,
                    }))
                  }
                />
              )}
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Condition
              </label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={conditions[item.id] || ""}
                onChange={(e) =>
                  setConditions((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
              >
                <option value="">Select condition</option>
                {conditionOptions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Upload Photos (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(item.id, e.target.files)}
              />
              <div className="flex gap-2 mt-2">
                {(photos[item.id] || []).map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="Uploaded"
                    className="w-12 h-12 object-cover rounded border"
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Photos help process your return faster
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6 gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => onNext({ reasons, otherReasons, conditions, photos })}
          disabled={!isValid}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
