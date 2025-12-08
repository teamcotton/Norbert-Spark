import { Box } from '@mui/material'
import type { UIDataTypes, UIMessagePart, UITools } from 'ai'
import { Streamdown } from 'streamdown'

export const Message = ({
  parts,
  role,
}: {
  role: string
  parts: UIMessagePart<UIDataTypes, UITools>[]
}) => {
  const prefix = role === 'user' ? 'User: ' : 'AI: '

  const text = parts
    .map((part) => {
      if (part.type === 'text') {
        return part.text
      }
      return ''
    })
    .join('')
  return (
    <Box
      sx={{
        color: 'rgba(0, 0, 0, 0.87) !important',
        '& p': { color: 'rgba(0, 0, 0, 0.87) !important' },
        '& div': { color: 'rgba(0, 0, 0, 0.87) !important' },
        '& *': { color: 'rgba(0, 0, 0, 0.87) !important' },
      }}
    >
      <Streamdown>{prefix + text}</Streamdown>
      {parts.map((part, index) => {
        if (part.type === 'tool-writeFile') {
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: 'rgba(30, 58, 138, 0.2)',
                border: '1px solid #1d4ed8',
                borderRadius: 1,
                padding: 1.5,
                fontSize: '0.875rem',
              }}
            >
              <Box sx={{ fontWeight: 600, color: '#93c5fd', marginBottom: 0.5 }}>
                📝 Wrote to file
              </Box>
              <Box sx={{ color: '#bfdbfe' }}>
                Path: {(part.input as { path?: string })?.path || 'Unknown'}
              </Box>
              <Box sx={{ color: '#bfdbfe' }}>
                Content length: {(part.input as { content?: string })?.content?.length || 0}{' '}
                characters
              </Box>
            </Box>
          )
        }
        if (part.type === 'tool-readFile') {
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: 'rgba(20, 83, 45, 0.2)',
                border: '1px solid #15803d',
                borderRadius: 1,
                padding: 1.5,
                fontSize: '0.875rem',
              }}
            >
              <Box sx={{ fontWeight: 600, color: '#86efac', marginBottom: 0.5 }}>📖 Read file</Box>
              <Box sx={{ color: '#bbf7d0' }}>
                Path: {(part.input as { path?: string })?.path || 'Unknown'}
              </Box>
            </Box>
          )
        }
        if (part.type === 'tool-deletePath') {
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: 'rgba(127, 29, 29, 0.2)',
                border: '1px solid #b91c1c',
                borderRadius: 1,
                padding: 1.5,
                fontSize: '0.875rem',
              }}
            >
              <Box sx={{ fontWeight: 600, color: '#fca5a5', marginBottom: 0.5 }}>
                🗑️ Deleted path
              </Box>
              <Box sx={{ color: '#fecaca' }}>
                Path: {(part.input as { path?: string })?.path || 'Unknown'}
              </Box>
            </Box>
          )
        }
        if (part.type === 'tool-listDirectory') {
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: 'rgba(113, 63, 18, 0.2)',
                border: '1px solid #a16207',
                borderRadius: 1,
                padding: 1.5,
                fontSize: '0.875rem',
              }}
            >
              <Box sx={{ fontWeight: 600, color: '#fde047', marginBottom: 0.5 }}>
                📁 Listed directory
              </Box>
              <Box sx={{ color: '#fef08a' }}>
                Path: {(part.input as { path?: string })?.path || 'Unknown'}
              </Box>
            </Box>
          )
        }
        if (part.type === 'tool-createDirectory') {
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: 'rgba(88, 28, 135, 0.2)',
                border: '1px solid #7e22ce',
                borderRadius: 1,
                padding: 1.5,
                fontSize: '0.875rem',
              }}
            >
              <Box sx={{ fontWeight: 600, color: '#d8b4fe', marginBottom: 0.5 }}>
                📂 Created directory
              </Box>
              <Box sx={{ color: '#e9d5ff' }}>
                Path: {(part.input as { path?: string })?.path || 'Unknown'}
              </Box>
            </Box>
          )
        }
        if (part.type === 'tool-exists') {
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: 'rgba(22, 78, 99, 0.2)',
                border: '1px solid #0e7490',
                borderRadius: 1,
                padding: 1.5,
                fontSize: '0.875rem',
              }}
            >
              <Box sx={{ fontWeight: 600, color: '#67e8f9', marginBottom: 0.5 }}>
                🔍 Checked existence
              </Box>
              <Box sx={{ color: '#a5f3fc' }}>
                Path: {(part.input as { path?: string })?.path || 'Unknown'}
              </Box>
            </Box>
          )
        }
        if (part.type === 'tool-searchFiles') {
          return (
            <Box
              key={index}
              sx={{
                backgroundColor: 'rgba(124, 45, 18, 0.2)',
                border: '1px solid #c2410c',
                borderRadius: 1,
                padding: 1.5,
                fontSize: '0.875rem',
              }}
            >
              <Box sx={{ fontWeight: 600, color: '#fdba74', marginBottom: 0.5 }}>
                🔎 Searched files
              </Box>
              <Box sx={{ color: '#fed7aa' }}>
                Pattern: {(part.input as { pattern?: string })?.pattern || 'Unknown'}
              </Box>
            </Box>
          )
        }
        return null
      })}
    </Box>
  )
}
