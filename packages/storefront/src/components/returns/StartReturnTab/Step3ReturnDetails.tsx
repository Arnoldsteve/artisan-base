"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { formatMoney } from "@/lib/money";

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
  const [otherReasons, setOtherReasons] = useState<{ [itemId: string]: string }>(
    {}
  );
  const [conditions, setConditions] = useState<{ [itemId: string]: string }>({});
  const [photos, setPhotos] = useState<{ [itemId: string]: File[] }>({});

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

  const defaultImage =
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Return Details</h2>

      {selectedItems.map((item) => (
        <Card key={item.id} className="border rounded-lg shadow-sm">
          <CardContent className="p-4 space-y-4">
            {/* Item header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Image
                src={defaultImage}
                alt={item.name}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-gray-500">
                  Variant: {item.variant}
                </div>
                <div className="text-xs text-gray-500">
                  {formatMoney(item.price)}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <Label className="block mb-1">Reason for return</Label>
              <Select
                value={reasons[item.id] || ""}
                onValueChange={(val) =>
                  setReasons((prev) => ({ ...prev, [item.id]: val }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {reasonOptions.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {reasons[item.id] === "Other" && (
                <Input
                  className="mt-2 w-full"
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

            {/* Condition */}
            <div>
              <Label className="block mb-1">Condition</Label>
              <Select
                value={conditions[item.id] || ""}
                onValueChange={(val) =>
                  setConditions((prev) => ({ ...prev, [item.id]: val }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((cond) => (
                    <SelectItem key={cond} value={cond}>
                      {cond}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photo Upload */}
            <div>
              <Label className="block mb-1">Upload Photos (optional)</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="w-full"
                onChange={(e) => handlePhotoUpload(item.id, e.target.files)}
              />
              {photos[item.id]?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {photos[item.id].map((file, idx) => (
                    <Image
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="Uploaded"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Photos help process your return faster
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
          Back
        </Button>
        <Button
          onClick={() => onNext({ reasons, otherReasons, conditions, photos })}
          disabled={!isValid}
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
