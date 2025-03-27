import React, { useState, useEffect } from "react";
import { Moon, Sun, Globe, Settings, ChevronDown, Check ,X} from "lucide-react";

const AccountSettings = () => {
  const [theme, setTheme] = useState(() => {
    return (
      localStorage.getItem("app-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app-language") || "en";
  });

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const languageOptions = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="min-h-screen bg-white-100 dark:bg-white-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white flex items-center">
          <Settings className="mr-3" size={24} />
          <h2 className="text-xl font-bold">Account Settings</h2>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Language Selection with Dropdown */}
          <div className="relative">
            <div className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
              <Globe className="mr-2" size={20} />
              <label className="font-semibold text-lg">Language</label>
            </div>
            <button
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md text-gray-700 dark:text-gray-300"
            >
              <span className="flex items-center">
                {languageOptions.find((lang) => lang.code === language)?.flag}{" "}
                <span className="ml-2">
                  {languageOptions.find((lang) => lang.code === language)?.name}
                </span>
              </span>
              <ChevronDown size={20} />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all ${
                      language === lang.code ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="text-2xl mr-2">{lang.flag}</span>
                      {lang.name}
                    </span>
                    {language === lang.code && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              {theme === "light" ? (
                <Moon className="mr-2" size={20} />
              ) : (
                <Sun className="mr-2" size={20} />
              )}
              <span className="font-semibold">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all"
            >
              Switch Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
