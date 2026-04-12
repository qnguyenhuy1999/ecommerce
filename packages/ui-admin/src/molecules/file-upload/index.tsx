'use client'

import * as React from 'react'
import { cn, Button } from '@ecom/ui'
import { UploadCloud, X, File as FileIcon, ImageIcon } from 'lucide-react'

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  accept?: string
  maxSize?: number // in bytes
  multiple?: boolean
  onUpload?: (files: File[]) => void
  disabled?: boolean
}

function FileUpload({ 
  accept, 
  maxSize = 10485760, // 10MB
  multiple = false, 
  onUpload,
  disabled = false,
  className,
  ...props 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [disabled])

  const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files))
    }
  }, [])

  const processFiles = (newFiles: File[]) => {
    // Basic validation could be expanded here (mime type, exact size)
    const validFiles = newFiles.filter(f => f.size <= maxSize)
    
    if (multiple) {
      setFiles(prev => [...prev, ...validFiles])
      if (onUpload) onUpload([...files, ...validFiles])
    } else {
      setFiles(validFiles.slice(0, 1))
      if (onUpload) onUpload(validFiles.slice(0, 1))
    }
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== indexToRemove)
      if (onUpload) onUpload(newFiles)
      return newFiles
    })
  }

  return (
    <div className={cn('space-y-4', className)} {...props}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[8px]',
          'transition-colors duration-200 ease-in-out',
          isDragging ? 'border-brand bg-brand-muted' : 'border-border hover:border-brand/50 hover:bg-muted/50',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
        />
        <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
        <p className="text-sm font-medium text-foreground">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          SVG, PNG, JPG or GIF (max. {Math.round(maxSize / 1024 / 1024)}MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-[8px] bg-background">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 shrink-0 bg-muted rounded-[6px] flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <FileIcon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { FileUpload }
