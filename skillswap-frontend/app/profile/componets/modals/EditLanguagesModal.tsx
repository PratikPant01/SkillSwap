
import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

type Language = {
    id?: number;
    language: string;
    level: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { languages: Language[] }) => void;
    initialData: Language[];
};

export default function EditLanguagesModal({ isOpen, onClose, onSave, initialData }: Props) {
    const [languagesList, setLanguagesList] = useState<Language[]>(initialData || []);
    const [newLang, setNewLang] = useState<Language>({
        language: "",
        level: "Beginner",
    });

    const levels = ["Beginner", "Conversational", "Fluent", "Native"];

    useEffect(() => {
        setLanguagesList(initialData || []);
    }, [initialData]);

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newLang.language.trim()) {
            setLanguagesList([...languagesList, { ...newLang, language: newLang.language.trim() }]);
            setNewLang({ language: "", level: "Beginner" });
        }
    };

    const handleRemove = (index: number) => {
        setLanguagesList(languagesList.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        let updatedList = [...languagesList];
        // If user typed something but didn't click add, add it for them
        if (newLang.language.trim()) {
            updatedList.push({ ...newLang, language: newLang.language.trim() });
        }
        onSave({ languages: updatedList });
        onClose();
    };

    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Edit Languages</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-3 mb-6">
                    {languagesList.map((lang, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <p className="font-semibold text-slate-800">{lang.language}</p>
                                <p className="text-xs text-slate-500">{lang.level}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h3 className="font-semibold text-sm text-slate-700">Add New Language</h3>
                    <input
                        type="text"
                        placeholder="Language (e.g. Spanish)"
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        value={newLang.language}
                        onChange={(e) => setNewLang({ ...newLang, language: capitalize(e.target.value) })}
                    />
                    <select
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        value={newLang.level}
                        onChange={(e) => setNewLang({ ...newLang, level: e.target.value })}
                    >
                        {levels.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAdd}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
                    >
                        <Plus size={16} /> Add Language
                    </button>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
