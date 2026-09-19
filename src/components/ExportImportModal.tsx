import { useState } from 'react';
import { X, Download, Upload, Check, AlertCircle } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  mode: 'export' | 'import';
  dataJson: string;
  onClose: () => void;
  onImportConfirm: (importedData: string) => boolean;
}

export function ExportImportModal({
  isOpen,
  mode,
  dataJson,
  onClose,
  onImportConfirm,
}: ExportImportModalProps) {
  const [importText, setImportText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dataJson);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([dataJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `networth-anda-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleProcessImport = () => {
    setErrorMessage(null);
    if (!importText.trim()) {
      setErrorMessage('Silakan tempel teks JSON backup terlebih dahulu.');
      return;
    }
    const success = onImportConfirm(importText);
    if (success) {
      onClose();
    } else {
      setErrorMessage('Format JSON tidak valid atau struktur data tidak sesuai.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            {mode === 'export' ? (
              <Download className="w-5 h-5 text-red-600" />
            ) : (
              <Upload className="w-5 h-5 text-amber-600" />
            )}
            <h3 className="font-extrabold text-neutral-900 text-base">
              {mode === 'export' ? 'Ekspor Cadangan Data (JSON)' : 'Impor Data Cadangan'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'export' ? (
          <div className="space-y-3">
            <p className="text-xs text-neutral-600">
              Simpan seluruh data profil, aset, liabilitas, target tabungan & bebas finansial, dan checklist Anda sebagai file cadangan. Data Anda 100% tersimpan secara lokal dan privat di browser ini.
            </p>
            <textarea
              readOnly
              value={dataJson}
              rows={8}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-mono text-neutral-800 focus:outline-none select-all"
            />
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-bold text-neutral-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copySuccess ? <Check className="w-4 h-4 text-red-600" /> : null}
                <span>{copySuccess ? 'Tersalin!' : 'Salin ke Clipboard'}</span>
              </button>
              <button
                onClick={handleDownloadFile}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File .JSON</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-neutral-600">
              Tempelkan (paste) teks JSON data cadangan yang pernah Anda ekspor sebelumnya untuk memulihkan seluruh data NetWorth Anda.
            </p>
            {errorMessage && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            <textarea
              placeholder='Tempelkan format JSON di sini...'
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={8}
              className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs font-mono text-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-stone-100 rounded-lg border border-stone-300"
              >
                Batal
              </button>
              <button
                onClick={handleProcessImport}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Terapkan Impor</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
