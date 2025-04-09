import React, { useState, ChangeEvent, useCallback } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import 'bootstrap/dist/css/bootstrap.min.css';

const DropZone = styled(Paper)(({ theme }) => ({
  width: '100%',
  minHeight: '200px',
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  }
}));

interface UploadState {
  file: File | null;
  uploading: boolean;
  error: string | null;
  success: boolean;
  progress: number;
  dragActive: boolean;
}

const Upload: React.FC = () => {
  const [state, setState] = useState<UploadState>({
    file: null,
    uploading: false,
    error: null,
    success: false,
    progress: 0,
    dragActive: false
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setState(prev => ({ ...prev, dragActive: true }));
    } else if (e.type === "dragleave") {
      setState(prev => ({ ...prev, dragActive: false }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, dragActive: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.dxf')) {
        setState(prev => ({ 
          ...prev, 
          file,
          error: null,
          success: false
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          error: 'Only DXF files are allowed'
        }));
      }
    }
  }, []);

  const handleUpload = async () => {
    if (!state.file) {
      setState(prev => ({ ...prev, error: 'Please select a file first' }));
      return;
    }

    if (!state.file.name.toLowerCase().endsWith('.dxf')) {
      setState(prev => ({ ...prev, error: 'Only DXF files are allowed' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      uploading: true, 
      error: null, 
      success: false,
      progress: 0 
    }));

    try {
      const formData = new FormData();
      formData.append('file', state.file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8001/api/files/upload');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setState(prev => ({ ...prev, progress }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setState(prev => ({ 
            ...prev, 
            uploading: false, 
            success: true,
            file: null,
            error: null,
            progress: 100
          }));
        } else {
          throw new Error(xhr.responseText || 'Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Network error occurred');
      };

      xhr.send(formData);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        uploading: false, 
        error: error instanceof Error ? error.message : 'Upload failed',
        progress: 0
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setState(prev => ({ 
        ...prev, 
        file: e.target.files![0],
        error: null,
        success: false
      }));
    }
  };

  const handleClearFile = () => {
    setState(prev => ({
      ...prev,
      file: null,
      error: null,
      success: false,
      progress: 0
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Alerts */}
      <Box sx={{ mb: 3 }}>
        {state.error && (
          <Alert 
            severity="error" 
            onClose={() => setState(prev => ({ ...prev, error: null }))}
            className="shadow-sm"
          >
            {state.error}
          </Alert>
        )}
        
        {state.success && (
          <Alert 
            severity="success" 
            onClose={() => setState(prev => ({ ...prev, success: false }))}
            className="shadow-sm"
          >
            File uploaded successfully!
          </Alert>
        )}
      </Box>

      {/* Drop Zone */}
      <DropZone
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        elevation={state.dragActive ? 3 : 1}
        className={state.dragActive ? 'shadow-lg' : 'shadow-sm'}
        sx={{
          borderColor: state.dragActive ? 'primary.main' : 'grey.300',
          mb: 3
        }}
      >
        <input
          type="file"
          accept=".dxf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload" style={{ width: '100%', cursor: 'pointer' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & Drop your DXF file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select file
            </Typography>
          </Box>
        </label>
      </DropZone>

      {/* File Info */}
      {state.file && (
        <Paper 
          elevation={1} 
          sx={{ p: 2, mb: 3 }}
          className="shadow-sm"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {state.file.name}
            </Typography>
            <Tooltip title="File size" arrow TransitionComponent={Zoom}>
              <Typography variant="body2" color="text.secondary">
                {(state.file.size / 1024).toFixed(1)} KB
              </Typography>
            </Tooltip>
            <IconButton 
              size="small" 
              onClick={handleClearFile}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      )}

      {/* Progress Bar */}
      {state.uploading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={state.progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center" 
            sx={{ mt: 1 }}
          >
            {state.progress}%
          </Typography>
        </Box>
      )}

      {/* Upload Button */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!state.file || state.uploading}
          size="large"
          className="shadow"
          sx={{ 
            minWidth: 150,
            borderRadius: 2
          }}
        >
          {state.uploading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </Button>
        <Tooltip 
          title="Only .dxf files are supported. Maximum file size: 10MB" 
          arrow 
          TransitionComponent={Zoom}
        >
          <IconButton color="primary">
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Upload;
