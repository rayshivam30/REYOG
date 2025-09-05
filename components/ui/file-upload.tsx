import { useCallback, useState } from "react"
import { useDropzone, FileWithPath } from "react-dropzone"
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type UploadedFile = {
  id: string
  url: string
  filename: string
  type: string
  size: number
  publicId: string
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  disabled?: boolean
}

export function FileUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ["image/*", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        console.error("Some files were rejected:", fileRejections)
        return
      }

      if (acceptedFiles.length + uploadedFiles.length > maxFiles) {
        console.error(`Cannot upload more than ${maxFiles} files`)
        return
      }

      setIsUploading(true)
      setProgress(0)

      try {
        const uploadPromises = acceptedFiles.map((file) => uploadFile(file))
        const results = await Promise.all(uploadPromises)
        
        const newFiles = results.filter(Boolean) as UploadedFile[]
        const allFiles = [...uploadedFiles, ...newFiles]
        
        setUploadedFiles(allFiles)
        onFilesChange(allFiles)
      } catch (error) {
        console.error("Error uploading files:", error)
      } finally {
        setIsUploading(false)
        setProgress(0)
      }
    },
    [maxFiles, onFilesChange, uploadedFiles]
  )

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: 'include',
      })

      console.log('Upload response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('Upload error:', error)
        throw new Error(error?.error?.message || 'Upload failed')
      }

      const result = await response.json()
      console.log('Upload result:', result)

      if (!result.success || !result.data?.file) {
        throw new Error('Invalid response from server')
      }

      return {
        id: result.data.file.publicId,
        url: result.data.file.url,
        filename: file.name,
        type: file.type,
        size: file.size,
        publicId: result.data.file.publicId,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  const removeFile = async (fileId: string, publicId: string) => {
    try {
      // Get the auth token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      // Add the authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/uploads?publicId=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
        headers
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || 'Failed to delete file')
      }

      const updatedFiles = uploadedFiles.filter((f) => f.id !== fileId)
      setUploadedFiles(updatedFiles)
      onFilesChange(updatedFiles)
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    disabled: isUploading || disabled || uploadedFiles.length >= maxFiles,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            {isDragActive ? (
              <p>Drop the files here</p>
            ) : (
              <p>
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
            )}
            <p className="text-xs">
              {acceptedTypes.join(", ")} (max {maxSize}MB each, up to {maxFiles} files)
            </p>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({uploadedFiles.length}/{maxFiles})</p>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-md bg-background border">
                    {file.type.startsWith("image") ? (
                      <ImageIcon className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{file.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file.id, file.publicId)
                  }}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
