'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/layout';
import { api } from '@/lib/api';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || (user.role !== 'admin' && user.role !== 'superadmin')) return null;

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [coverPreview, videoPreview]);

  const validateFile = (f: File, type: 'app' | 'image' | 'video'): string | null => {
    const name = f.name.toLowerCase();
    if (type === 'app') {
      if (!name.endsWith('.apk') && !name.endsWith('.exe')) return 'Only APK and EXE files are allowed';
      if (f.size > 1073741824) return 'File size exceeds 1GB limit';
    } else if (type === 'image') {
      if (!['.jpg', '.jpeg', '.png', '.webp'].some(e => name.endsWith(e))) return 'Only JPG, PNG, and WebP images are allowed';
      if (f.size > 10485760) return 'Image size exceeds 10MB limit';
    } else if (type === 'video') {
      if (!name.endsWith('.mp4') && !name.endsWith('.webm')) return 'Only MP4 and WebM videos are allowed';
      if (f.size > 524288000) return 'Video size exceeds 500MB limit';
    }
    if (f.size === 0) return 'File is empty';
    return null;
  };

  const handleAppFile = (f: File) => {
    const err = validateFile(f, 'app');
    if (err) { setError(err); return; }
    setFile(f);
    setError('');
  };

  const handleCoverImage = (f: File) => {
    const err = validateFile(f, 'image');
    if (err) { setError(err); return; }
    setCoverImage(f);
    setCoverPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleVideo = (f: File) => {
    const err = validateFile(f, 'video');
    if (err) { setError(err); return; }
    setVideo(f);
    const previewUrl = URL.createObjectURL(f);
    setVideoPreview(previewUrl);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.onloadedmetadata = () => {
      setVideoDuration(tempVideo.duration);
      setTrimEnd(tempVideo.duration);
    };
    tempVideo.src = previewUrl;
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) {
      setError('App name and file are required');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('name', name.trim());
      fd.append('description', description.trim());
      if (coverImage) fd.append('coverImage', coverImage);
      if (video) {
        fd.append('video', video);
        if (trimStart > 0) fd.append('trimStart', String(trimStart));
        if (trimEnd < videoDuration) fd.append('trimEnd', String(trimEnd));
      }
      await api.apps.upload(fd);
      setSuccess('App uploaded successfully!');
      setName('');
      setDescription('');
      setFile(null);
      setCoverImage(null);
      setVideo(null);
      setVideoPreview(null);
      setCoverPreview(null);
      setTrimStart(0);
      setTrimEnd(0);
      setVideoDuration(0);
      if (fileRef.current) fileRef.current.value = '';
      if (coverRef.current) coverRef.current.value = '';
      if (videoRef.current) videoRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="section-title">Upload App</h1>
          <p className="section-subtitle mt-1">Add a new application to the marketplace</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6 text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* App Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                App Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. YouTube Premium"
                className="input-field"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what this app does, its features, and system requirements..."
                className="input-field min-h-[100px] resize-y"
                maxLength={1000}
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Cover Image
              </label>
              <div
                onClick={() => coverRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  coverPreview
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-surface-border hover:border-primary/30 hover:bg-white/5'
                }`}
              >
                <input
                  ref={coverRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={e => e.target.files?.[0] && handleCoverImage(e.target.files[0])}
                  className="hidden"
                />
                {coverPreview ? (
                  <div className="relative">
                    <img src={coverPreview} alt="Cover preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                    <p className="text-xs text-gray-500 mt-2">Click to change cover image</p>
                  </div>
                ) : (
                  <div className="py-4">
                    <svg className="w-8 h-8 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">Upload cover image</p>
                    <p className="text-xs text-gray-600 mt-1">JPG, PNG, or WebP (max 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Video */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                How-to Video <span className="text-gray-600">(optional)</span>
              </label>
              <div
                onClick={() => !video && videoRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                  video
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-surface-border hover:border-primary/30 hover:bg-white/5'
                }`}
              >
                <input
                  ref={videoRef}
                  type="file"
                  accept=".mp4,.webm"
                  onChange={e => e.target.files?.[0] && handleVideo(e.target.files[0])}
                  className="hidden"
                />
                {video ? (
                  <div>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-primary text-left">{video.name}</p>
                        <p className="text-xs text-gray-500 text-left">{(video.size / 1024 / 1024).toFixed(1)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); videoRef.current?.click(); }}
                      className="text-xs text-gray-500 hover:text-primary transition-colors"
                    >
                      Change video
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <svg className="w-8 h-8 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">Upload tutorial video</p>
                    <p className="text-xs text-gray-600 mt-1">MP4 or WebM (max 500MB)</p>
                  </div>
                )}
              </div>

              {/* Video Preview + Trim Controls */}
              {videoPreview && videoDuration > 0 && (
                <div className="mt-4 space-y-3">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full rounded-lg max-h-48 bg-black"
                  />
                  <div className="space-y-2 p-3 rounded-lg bg-surface-light/50 border border-surface-border">
                    <p className="text-xs font-medium text-gray-400">Trim Video</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {trimStart.toFixed(1)}s
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={videoDuration}
                        step={0.1}
                        value={trimStart}
                        onClick={e => e.stopPropagation()}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          if (val < trimEnd) setTrimStart(val);
                        }}
                        className="flex-1 accent-primary h-1.5 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 w-12">
                        {trimEnd.toFixed(1)}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={videoDuration}
                      step={0.1}
                      value={trimEnd}
                      onClick={e => e.stopPropagation()}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        if (val > trimStart) setTrimEnd(val);
                      }}
                      className="w-full accent-primary h-1.5 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600">
                      <span>Start: {trimStart.toFixed(1)}s</span>
                      <span>End: {trimEnd.toFixed(1)}s</span>
                      <span>Duration: {(trimEnd - trimStart).toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* App File */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                App File <span className="text-red-400">*</span>
              </label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleAppFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-primary bg-primary/10'
                    : file
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-surface-border hover:border-primary/30 hover:bg-white/5'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".apk,.exe"
                  onChange={e => e.target.files?.[0] && handleAppFile(e.target.files[0])}
                  className="hidden"
                />
                {file ? (
                  <div>
                    <svg className="w-8 h-8 mx-auto text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-primary font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    <p className="text-xs text-gray-600 mt-2">Click or drop to change</p>
                  </div>
                ) : (
                  <div className="py-6">
                    <svg className="w-10 h-10 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-400">Drop APK or EXE file here</p>
                    <p className="text-xs text-gray-600 mt-1">or click to browse (max 1GB)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !file || !name.trim()}
              className="btn-primary w-full py-3 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Publish App'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
