'use client'

import { Box, Container, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid'
import { useState } from 'react'

// User type based on database schema
interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: string
}

// Dummy data for testing - sorted by createdAt descending (newest first)
const dummyUsers: GridRowsProp<User> = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    createdAt: '2025-12-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'moderator',
    createdAt: '2025-12-14T15:45:00Z',
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@example.com',
    role: 'user',
    createdAt: '2025-12-13T09:20:00Z',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'user',
    createdAt: '2025-12-12T14:15:00Z',
  },
  {
    id: '5',
    name: 'Eve Martinez',
    email: 'eve@example.com',
    role: 'moderator',
    createdAt: '2025-12-11T11:00:00Z',
  },
  {
    id: '6',
    name: 'Frank Wilson',
    email: 'frank@example.com',
    role: 'user',
    createdAt: '2025-12-10T16:30:00Z',
  },
  {
    id: '7',
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'admin',
    createdAt: '2025-12-09T13:45:00Z',
  },
  {
    id: '8',
    name: 'Henry Davis',
    email: 'henry@example.com',
    role: 'user',
    createdAt: '2025-12-08T10:00:00Z',
  },
]

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('')
  // TODO: Replace with actual user role from authentication
  const currentUserRole = 'admin' as 'admin' | 'moderator' | 'user'

  // Define columns
  const columns: GridColDef<User>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      editable: currentUserRole === 'admin',
    },
    {
      field: 'email',
      headerName: 'Email Address',
      flex: 1,
      minWidth: 200,
      editable: currentUserRole === 'admin',
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      editable: currentUserRole === 'admin',
      type: 'singleSelect',
      valueOptions: ['user', 'admin', 'moderator'],
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      editable: false,
      valueFormatter: (value: string) => {
        return new Date(value).toLocaleString()
      },
    },
  ]

  // Filter users based on search query (searches name, email, and role)
  const filteredUsers = dummyUsers.filter((user) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  })

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {currentUserRole === 'admin'
            ? 'Manage user accounts and roles'
            : 'View user accounts (read-only access)'}
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          label="Search users"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300 }}
          placeholder="Search by name, email, or role..."
        />
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
            sorting: {
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection={currentUserRole === 'admin'}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: currentUserRole === 'admin' ? 'pointer' : 'default',
            },
          }}
        />
      </Box>

      {currentUserRole === 'moderator' && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Note: You have read-only access. Contact an administrator to modify user data.
        </Typography>
      )}
    </Container>
  )
}
