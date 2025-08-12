import React, { useState } from "react"; 
import { useTranslation } from "react-i18next";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FiSave, 
  FiEdit2, 
  FiX
} from "react-icons/fi";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "ገበሬው",
    email: "ገበሬው@example.com",
    phone: "+251912345678",
    address: "Ethiopia"
  });
  const [editData, setEditData] = useState({ ...user });

  const handleEditClick = () => {
    setEditData({ ...user });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUser({ ...editData });
    setIsEditing(false);
    // API call to save updated user info can be placed here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">
                {t("profile.title")}
              </CardTitle>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  onClick={handleEditClick}
                  className="gap-2"
                >
                  <FiEdit2 className="h-4 w-4" />
                  {t("profile.editProfile")}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="gap-2"
                  >
                    <FiX className="h-4 w-4" />
                    {t("profile.cancel")}
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="gap-2"
                  >
                    <FiSave className="h-4 w-4" />
                    {t("profile.save")}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("profile.name")}</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-lg p-2 border-b">{user.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("profile.email")}</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={editData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-lg p-2 border-b">{user.email}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("profile.phone")}</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-lg p-2 border-b">{user.phone}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t("profile.address")}</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      name="address"
                      value={editData.address}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="text-lg p-2 border-b">{user.address}</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
