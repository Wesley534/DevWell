import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";

export function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("notifications");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [language, setLanguage] = useState("English");

  const tabs = ["notifications", "privacy"];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Back Button */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="default"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">Settings</h1>
        <div className="w-16" /> {/* Placeholder for spacing */}
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto flex gap-4 mb-6 border-b pb-2">
        {tabs.map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            size="default"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {activeTab === "notifications" && (
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-emerald-100 dark:bg-emerald-800 rounded-t-lg p-4">
              <CardTitle className="text-emerald-800 dark:text-emerald-200">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remindersEnabled}
                  onChange={() => setRemindersEnabled(!remindersEnabled)}
                  className="accent-emerald-500"
                />
                Enable reminders
              </label>
            </CardContent>
          </Card>
        )}

        {activeTab === "privacy" && (
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-emerald-100 dark:bg-emerald-800 rounded-t-lg p-4">
              <CardTitle className="text-emerald-800 dark:text-emerald-200">Privacy</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
                  className="accent-emerald-500"
                />
                Share analytics data
              </label>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Settings;
