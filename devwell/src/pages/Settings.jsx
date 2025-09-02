import { useState } from "react";
import { Button } from "../components/ui/Button";
import {Card, CardHeader, CardTitle, CardContent} from "../components/ui/Card";

export function Settings() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [language, setLanguage] = useState("English");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        {["notifications", "privacy", "integrations", "data", "preferences"].map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            size="default"
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remindersEnabled}
                  onChange={() => setRemindersEnabled(!remindersEnabled)}
                />
                Enable reminders
              </label>
            </CardContent>
          </Card>
        )}

        {activeTab === "privacy" && (
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={() => setAnalyticsEnabled(!analyticsEnabled)}
                />
                Share analytics data
              </label>
            </CardContent>
          </Card>
        )}

        {activeTab === "integrations" && (
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="default">Connect Google</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "data" && (
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline">Export Data</Button>
              <Button variant="default">Delete Account</Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "preferences" && (
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block mb-2">Language</label>
              <select
                className="border p-2 rounded"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>English</option>
                <option>Swahili</option>
              </select>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
export default Settings;