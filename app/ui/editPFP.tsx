import { Button, Portal } from "@mui/material";
import { Camera } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import Cropper, { Point } from "react-easy-crop";
import { useDebouncedCallback } from "use-debounce";

interface editProfileProps {
  showCropper: boolean;
  setShowCropper: React.Dispatch<React.SetStateAction<boolean>>;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
    profilePicture: File | null;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      image: string;
      profilePicture: File | null;
    }>
  >;
  selectedImage?: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditProfilePicture = ({
  showCropper,
  setShowCropper,
  formData,
  setFormData,
  selectedImage,
  setSelectedImage,
  handleChange,
}: editProfileProps) => {
  const [crop, setCrop] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [cropComplete, setCropComplete] = useState({
    croppedAreaPixels: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  });
  const debouncedSetCrop = useDebouncedCallback(setCrop, 10);
  const debouncedSetZoom = useDebouncedCallback(setZoom, 10);

  const handleCropComplete = async () => {
    const { croppedAreaPixels } = cropComplete;
    const canvas = document.createElement("canvas");
    const image = new window.Image();
    image.src = selectedImage ? selectedImage : "";

    image.onload = () => {
      const ctx = canvas.getContext("2d");
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx?.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped-image.png", {
            type: "image/png",
          });
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              setFormData({
                ...formData,
                image: reader.result.toString(), // Base64 string for preview
                profilePicture: file, // File object for upload
              });
              setShowCropper(false);
              setSelectedImage(null);
            }
          };
          reader.readAsDataURL(blob); // Convert blob to Base64 string
        }

        setShowCropper(false);
      });
    };
  };

  return (
    <>
      {showCropper && selectedImage && (
        <Portal container={document.getElementById("root")}>
          <div className="fixed inset-0 p-20 flex flex-col z-50 bg-black/50">
            <Cropper
              image={selectedImage}
              classes={{
                containerClassName:
                  "flex-1 max-w-[800px] my-40 bg-transparent mx-auto",
              }}
              crop={crop}
              zoom={zoom}
              zoomSpeed={5}
              aspect={1}
              onCropChange={debouncedSetCrop}
              onZoomChange={debouncedSetZoom}
              onCropComplete={(croppedArea, croppedAreaPixels) => {
                setCropComplete({ croppedAreaPixels });
              }}
            />
            <Portal
              container={document.querySelector("div.reactEasyCrop_Container")}
            >
              <div className="absolute flex gap-4 bottom-0">
                <Button
                  variant={"contained"}
                  color="error"
                  onClick={() => setShowCropper(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCropComplete} variant="contained">
                  Done
                </Button>
              </div>
            </Portal>
          </div>
        </Portal>
      )}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-[200px] max-md:w-[150px] aspect-square overflow-hidden">
          <Image
            src={formData.image || "/pfp.png"}
            className="rounded-full object-cover overflow-hidden"
            alt="Profile Picture"
            sizes="100%"
            fill={true}
          />
        </div>
        <label
          htmlFor="image"
          className="flex items-center space-x-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50/5 duration-50"
        >
          <Camera className="h-4 w-4" />
          Change Picture
          <input
            type="file"
            name="image"
            id="image"
            hidden
            accept="image/*"
            onChange={handleChange}
          />
        </label>
      </div>
    </>
  );
};

export default EditProfilePicture;
