
import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

type Education = {
    id?: number;
    institution: string;
    degree: string;
    start_year: string;
    end_year: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { education: Education[] }) => void;
    initialData: Education[];
};

export default function EditEducationModal({ isOpen, onClose, onSave, initialData }: Props) {
    const [educationList, setEducationList] = useState<Education[]>(initialData || []);
    const [newEdu, setNewEdu] = useState<Education>({
        institution: "",
        degree: "",
        start_year: "",
        end_year: "",
    });

    useEffect(() => {
        setEducationList(initialData || []);
    }, [initialData]);

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newEdu.institution && newEdu.degree) {
            setEducationList([...educationList, newEdu]);
            setNewEdu({ institution: "", degree: "", start_year: "", end_year: "" });
        }
    };

    const handleRemove = (index: number) => {
        setEducationList(educationList.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        let updatedList = [...educationList];
        // If user typed something but didn't click add, add it for them
        if (newEdu.institution.trim() && newEdu.degree.trim()) {
            updatedList.push(newEdu);
        }
        onSave({ education: updatedList });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Edit Education</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {educationList.map((edu, index) => (
                        <div key={index} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <p className="font-semibold text-slate-800">{edu.institution}</p>
                                <p className="text-sm text-slate-600">{edu.degree}</p>
                                <p className="text-xs text-slate-500">{edu.start_year} - {edu.end_year}</p>
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
                    <h3 className="font-semibold text-sm text-slate-700">Add New Education</h3>
                    <input
                        type="text"
                        placeholder="Institution / School"
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        value={newEdu.institution}
                        onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Degree / Certificate"
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm"
                        value={newEdu.degree}
                        onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Start Year"
                            className="w-1/2 border border-slate-300 rounded-lg p-2 text-sm"
                            value={newEdu.start_year}
                            onChange={(e) => setNewEdu({ ...newEdu, start_year: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="End Year"
                            className="w-1/2 border border-slate-300 rounded-lg p-2 text-sm"
                            value={newEdu.end_year}
                            onChange={(e) => setNewEdu({ ...newEdu, end_year: e.target.value })}
                        />
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
                    >
                        <Plus size={16} /> Add Education
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
