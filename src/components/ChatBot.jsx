import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Container,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import responses from '../data/responses.json';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check each category for matching patterns
    for (const category in responses) {
      if (category === 'default') continue;
      
      const patterns = responses[category].patterns;
      if (patterns.some(pattern => message.includes(pattern))) {
        const responsesList = responses[category].responses;
        return responsesList[Math.floor(Math.random() * responsesList.length)];
      }
    }

    // If no match found, return a default response
    const defaultResponses = responses.default.responses;
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = {
        text: input,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInput('');

      // Get bot response from JSON
      setTimeout(() => {
        const botResponse = {
          text: getBotResponse(input),
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: 'primary.main',
            color: 'white',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">ChatBot</Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                gap: 1,
              }}
            >
              {!message.isUser && (
                <Avatar sx={{ bgcolor: 'primary.main' }}>B</Avatar>
              )}
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: message.isUser ? 'primary.main' : 'grey.100',
                  color: message.isUser ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    opacity: 0.7,
                  }}
                >
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
              {message.isUser && (
                <Avatar sx={{ bgcolor: 'secondary.main' }}>U</Avatar>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatBot; 