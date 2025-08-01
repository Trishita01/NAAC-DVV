import { useState, useEffect, useRef } from 'react';
import Header from "../../components/header";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Bottom from "../../components/bottom";


const Criteria6_5_2 = () => {
  const [metrics, setMetrics] = useState([
    {
      id: '6.5.2',
      description: 'Describe any two examples of institutional reviews and implementation of teaching learning reforms facilitated by the IQAC within a maximum of 500 words each',
      response: '',
      wordCount: 0,
      isComplete: false,
      isExpanded: true,
      files: [],
      mandatory: false,
      lastSaved: null
    }
  ]);
  


  const [saving, setSaving] = useState(false);
  const [autoSaveTimestamp, setAutoSaveTimestamp] = useState(null);
  const textareaRefs = useRef({});
  const autoSaveTimerRef = useRef(null);

  const handleResponseChange = (id, value) => {
    setSaving(true);
    const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
    setMetrics(prev =>
      prev.map(metric =>
        metric.id === id
          ? { ...metric, response: value, wordCount, isComplete: wordCount >= 500 }
          : metric
      )
    );

    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => saveMetric(id), 3000);
  };

  const saveMetric = id => {
    setSaving(true);
    setTimeout(() => {
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMetrics(prev =>
        prev.map(metric =>
          metric.id === id ? { ...metric, lastSaved: timeString } : metric
        )
      );
      setSaving(false);
      setAutoSaveTimestamp(timeString);
    }, 800);
  };

  const handleFileUpload = (id, e) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setMetrics(prev =>
      prev.map(metric =>
        metric.id === id
          ? { ...metric, files: [...metric.files, ...newFiles] }
          : metric
      )
    );
    saveMetric(id);
  };

  const removeFile = (metricId, fileId) => {
    setMetrics(prev =>
      prev.map(metric =>
        metric.id === metricId
          ? { ...metric, files: metric.files.filter(f => f.id !== fileId) }
          : metric
      )
    );
    saveMetric(metricId);
  };

  const handleSubmit = () => {
    const incomplete = metrics.filter(m => !m.isComplete && m.mandatory);
    if (incomplete.length > 0) {
      alert(`Please complete all mandatory metrics: ${incomplete.map(m => m.id).join(', ')}`);
      return;
    }
    alert('All metrics submitted successfully!');
  };

  const saveAllAsDraft = () => {
    metrics.forEach(m => saveMetric(m.id));
    alert('All metrics saved as draft.');
  };

  useEffect(() => {
    const handleBlur = id => saveMetric(id);
    Object.keys(textareaRefs.current).forEach(id => {
      const textarea = textareaRefs.current[id];
      if (textarea) {
        textarea.addEventListener('blur', () => handleBlur(id));
      }
    });
    return () => {
      Object.keys(textareaRefs.current).forEach(id => {
        const textarea = textareaRefs.current[id];
        if (textarea) {
          textarea.removeEventListener('blur', () => handleBlur(id));
        }
      });
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [metrics]);

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col">
      <Header />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 flex flex-col p-4">
          {/* Page Title and Date */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Criteria 6: Governance, Leadership and Management</h2>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-blue-600 font-medium mb-2">6.5.2 Metric Information</h3>
            <p className="text-sm text-gray-700 mb-4">
              The institution reviews its teaching learning process, structures & 
methodologies of operations and learning outcomes at periodic 
intervals through IQAC set up as per norms and recorded the 
incremental improvement in various activities 
( For first cycle - Incremental improvements made for the preceding 
five years with regard to quality 
For second and subsequent cycles - Incremental improvements made 
for the preceding five years with regard to quality and post 
accreditation quality initiatives )</p>
            <h4 className="text-blue-600 font-medium mb-2">Required Documents:</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
              
              <li>Paste link for additional information</li>
              <li>Upload any additional information</li>
            </ul>
          </div>

          {/* Metrics Section */}
          <div className="flex-1">
            {metrics.map(metric => (
              <div key={metric.id} className="bg-white rounded-lg shadow-md mb-6 w-full">
                <div
                  className={`p-4 flex justify-between items-center cursor-pointer ${metric.isExpanded ? 'bg-indigo-50' : 'bg-white'}`}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-950">{metric.id}: {metric.description}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      {metric.mandatory ? <span className="text-red-600">Mandatory</span> : <span></span>}
                      {metric.lastSaved && (
                        <span className="ml-4">Last saved at {metric.lastSaved}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {metric.wordCount}/500 words {metric.wordCount >= 500 ? '✓' : ''}
                  </div>
                </div>

                {metric.isExpanded && (
                  <div className="p-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualitative Response <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      ref={el => (textareaRefs.current[metric.id] = el)}
                      value={metric.response}
                      onChange={e => handleResponseChange(metric.id, e.target.value)}
                      placeholder="Enter your qualitative response here (minimum 500 words required)..."
                      className={`w-full min-h-[200px] text-gray-950 p-4 border rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 ${metric.wordCount >= 100 ? 'border-green-300' : 'border-gray-300'}`}
                    ></textarea>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>
                        {metric.wordCount < 100 ? (
                          <span className="text-amber-600">
                            <i className="fas fa-exclamation-triangle mr-1"></i> Please write at least 500 words
                          </span>
                        ) : (
                          <span className="text-green-600">
                            <i className="fas fa-check-circle mr-1"></i> Minimum word count met
                          </span>
                        )}
                      </span>
                      <span>
                        {saving ? (
                          <span><i className="fas fa-sync-alt fa-spin mr-1"></i> Saving...</span>
                        ) : metric.lastSaved ? (
                          <span>Saved at {metric.lastSaved}</span>
                        ) : null}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="mt-auto bg-white border-t border-gray-200 shadow-inner py-4 px-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {autoSaveTimestamp ? (
                <span><i className="fas fa-save mr-1"></i> Auto-saved at {autoSaveTimestamp}</span>
              ) : (
                <span>Changes will be auto-saved</span>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={saveAllAsDraft}
                className="px-4 py-2 border border-blue-600 shadow-sm text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <i className="fas fa-save mr-2"></i> Save as Draft
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <i className="fas fa-paper-plane mr-2"></i> Submit All Metrics
              </button>
               <button
               
               >Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria6_5_2;
