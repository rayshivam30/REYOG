"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, ImageIcon, FileText } from "lucide-react"

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadProgress?: number
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx"],
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles).slice(0, maxFiles - files.length)

    newFiles.forEach((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
        return
      }

      uploadFile(file)
    })
  }

  const uploadFile = async (file: File) => {
    const fileId = Math.random().toString(36).substring(7)
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: "",
      uploadProgress: 0,
    }

    setFiles((prev) => [...prev, newFile])
    setIsUploading(true)

    try {
      // Get signed upload URL
      const signResponse = await fetch("/api/uploads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      })

      const signData = await signResponse.json()

      if (!signResponse.ok) {
        throw new Error(signData.error?.message || "Failed to get upload URL")
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, uploadProgress: Math.min((f.uploadProgress || 0) + 10, 90) } : f)),
        )
      }, 100)

      // Upload file (simplified - in real implementation, you'd upload to the signed URL)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      clearInterval(progressInterval)

      // Update file with final URL
      const updatedFiles = files.map((f) =>
        f.id === fileId ? { ...f, url: signData.downloadUrl, uploadProgress: 100 } : f,
      )

      setFiles(updatedFiles)
      onFilesChange(updatedFiles)
    } catch (error) {
      console.error("Upload failed:", error)
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={className}>
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFileSelect(e.dataTransfer.files)
        }}
      >
        <CardContent className="p-6 text-center">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to select</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || files.length >= maxFiles}
          >
            Choose Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Max {maxFiles} files, {maxSize}MB each. Supported: Images, PDF, DOC
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                  <Progress value={file.uploadProgress} className="mt-1 h-1" />
                )}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
