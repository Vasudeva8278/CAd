import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Visibility, Download } from '@mui/icons-material';

interface Block {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface BlockListState {
  blocks: Block[];
  loading: boolean;
  error: string | null;
  search: string;
}

const BlockList: React.FC = () => {
  const [state, setState] = useState<BlockListState>({
    blocks: [],
    loading: false,
    error: null,
    search: ''
  });

  const fetchBlocks = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`http://localhost:8001/api/files/blocks?name=${state.search}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blocks');
      }
      const data = await response.json();
      setState(prev => ({
        ...prev,
        blocks: data.data || [],
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blocks'
      }));
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchBlocks();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [state.search]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, search: e.target.value }));
  };

  const handleViewBlock = (blockId: number) => {
    // TODO: Implement block preview
    console.log('View block:', blockId);
  };

  const handleDownloadBlock = (blockId: number) => {
    // TODO: Implement block download
    console.log('Download block:', blockId);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search blocks by name..."
        value={state.search}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: state.loading && (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          )
        }}
      />

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      <Paper elevation={0} variant="outlined">
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {state.blocks.length === 0 ? (
            <ListItem>
              <ListItemText
                primary={
                  <Typography color="text.secondary">
                    {state.loading ? 'Loading blocks...' : 'No blocks found'}
                  </Typography>
                }
              />
            </ListItem>
          ) : (
            state.blocks.map((block, index) => (
              <React.Fragment key={block.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={block.name}
                    secondary={`Position: (${block.x}, ${block.y})`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="view"
                      onClick={() => handleViewBlock(block.id)}
                      sx={{ mr: 1 }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="download"
                      onClick={() => handleDownloadBlock(block.id)}
                    >
                      <Download />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default BlockList;
