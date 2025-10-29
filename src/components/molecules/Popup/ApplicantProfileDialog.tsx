import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/atoms/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@components/atoms/avatar";
import { img_avatar_placeholder } from "@assets/images";
import { Icon } from "@iconify/react";

interface ApplicantData {
  id: number | string;
  photoProfile?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  dateOfBirth?: string;
  gender?: string;
  domicile?: string;
  linkedinLink?: string;
  createdAt?: string;
  [key: string]: any;
}

interface ApplicantProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: ApplicantData | null;
}

export default function ApplicantProfileDialog({
  open,
  onOpenChange,
  applicant,
}: ApplicantProfileDialogProps) {
  if (!applicant) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPhoneNumber = () => {
    if (!applicant.phoneNumber) return "-";
    return `${applicant.countryCode || "+62"} ${applicant.phoneNumber}`;
  };

  const getInitials = (name?: string) => {
    if (!name) return "NA";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Applicant Profile
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-6">
          {/* Profile Image Section */}
          <div className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={applicant.photoProfile || img_avatar_placeholder.src}
                alt={applicant.fullName || "Applicant"}
                className="object-cover"
              />
              <AvatarFallback className="bg-secondary/10 text-secondary text-2xl">
                {getInitials(applicant.fullName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Personal Information */}
          <div className="grid gap-4">
            <h3 className="text-font-primary border-b pb-2 text-base font-semibold">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoItem
                icon="mdi:account"
                label="Full Name"
                value={applicant.fullName || "-"}
              />
              <InfoItem
                icon="mdi:email"
                label="Email"
                value={applicant.email || "-"}
              />
              <InfoItem
                icon="mdi:phone"
                label="Phone Number"
                value={formatPhoneNumber()}
              />
              <InfoItem
                icon="mdi:calendar"
                label="Date of Birth"
                value={formatDate(applicant.dateOfBirth)}
              />
              <InfoItem
                icon="mdi:human-male-female"
                label="Gender"
                value={applicant.gender || "-"}
              />
              <InfoItem
                icon="mdi:map-marker"
                label="Domicile"
                value={applicant.domicile || "-"}
              />
            </div>
          </div>

          {/* Social Media */}
          {applicant.linkedinLink && (
            <div className="grid gap-4">
              <h3 className="text-font-primary border-b pb-2 text-base font-semibold">
                Social Media
              </h3>
              <div className="flex items-center gap-3">
                <Icon icon="mdi:linkedin" className="text-xl text-[#0A66C2]" />
                <a
                  href={applicant.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary break-all hover:underline"
                >
                  {applicant.linkedinLink}
                </a>
              </div>
            </div>
          )}

          {/* Application Date */}
          {applicant.createdAt && (
            <div className="grid gap-4">
              <h3 className="text-font-primary border-b pb-2 text-base font-semibold">
                Application Details
              </h3>
              <InfoItem
                icon="mdi:clock-outline"
                label="Applied On"
                value={formatDate(applicant.createdAt)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Icon icon={icon} className="text-secondary text-lg" />
        <span className="text-font-natural text-xs font-medium">{label}</span>
      </div>
      <p className="text-font-primary ml-7 text-sm">{value}</p>
    </div>
  );
}
