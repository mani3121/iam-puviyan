import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import {
  fetchOrganizationMembers,
  getOrCreateOrganizationProfile,
  grantOrganizationAccess,
  updateOrganizationName,
  type OrganizationMember,
  type OrganizationProfile
} from '../services/firebaseService'

export default function UserProfileContent() {
  const userEmail = useMemo(() => localStorage.getItem('userEmail') || '', [])
  const userId = useMemo(() => localStorage.getItem('userId') || '', [])

  const [profile, setProfile] = useState<OrganizationProfile | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  
  const [orgNameInput, setOrgNameInput] = useState('')
  const [savingOrgName, setSavingOrgName] = useState(false)

  const [grantEmail, setGrantEmail] = useState('')
  const [grantRole, setGrantRole] = useState<'admin' | 'member' | 'viewer'>('member')
  const [granting, setGranting] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const actor = useMemo(() => ({ userId, email: userEmail }), [userEmail, userId])

  const orgId = profile?.id || userId

  const refreshMembers = async (effectiveOrgId: string) => {
    const membersResult = await fetchOrganizationMembers(effectiveOrgId)

    if (membersResult.success) {
      setMembers(membersResult.members)
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        setSuccess('')

        if (!userEmail || !userId) {
          setError('Missing session details. Please log out and log in again.')
          return
        }

        const orgResult = await getOrCreateOrganizationProfile(userId, userEmail)
        if (!orgResult.success || !orgResult.profile) {
          setError(orgResult.message || 'Failed to load organization profile.')
          return
        }

        setProfile(orgResult.profile)
        setOrgNameInput(orgResult.profile.organizationName || '')

        await refreshMembers(orgResult.profile.id)
      } catch (e) {
        console.error(e)
        setError('Failed to load profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [userEmail, userId])

  const handleSaveOrgName = async () => {
    if (!profile) return

    try {
      setSavingOrgName(true)
      setError('')
      setSuccess('')

      const result = await updateOrganizationName(profile.id, orgNameInput, actor)
      if (!result.success) {
        setError(result.message)
        return
      }

      setProfile(prev => (prev ? { ...prev, organizationName: orgNameInput.trim() } : prev))
      setSuccess('Organization name updated.')

      await refreshMembers(profile.id)
    } catch (e) {
      console.error(e)
      setError('Failed to update organization name.')
    } finally {
      setSavingOrgName(false)
    }
  }

  const handleGrantAccess = async () => {
    if (!orgId) return

    try {
      setGranting(true)
      setError('')
      setSuccess('')

      const result = await grantOrganizationAccess(orgId, grantEmail, grantRole, actor)
      if (!result.success) {
        setError(result.message)
        return
      }

      setSuccess('Access granted.')
      setGrantEmail('')

      await refreshMembers(orgId)
    } catch (e) {
      console.error(e)
      setError('Failed to grant access.')
    } finally {
      setGranting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress sx={{ color: '#4CAF50' }} />
      </Box>
    )
  }

  return (
    <Box>
      <Stack spacing={3}>

        {error && (
          <Alert severity="error" sx={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex' }}>
            <Card variant="outlined" sx={{ backgroundColor: '#2C2C2C', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Organization
                  </Typography>

                  <TextField
                    label="Organization Name"
                    value={orgNameInput}
                    onChange={(e) => setOrgNameInput(e.target.value)}
                    fullWidth
                    placeholder="Enter organization name"
                  />

                  <TextField
                    label="Owner Email"
                    value={profile?.ownerEmail || userEmail}
                    fullWidth
                    disabled
                  />

                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleSaveOrgName}
                      disabled={savingOrgName || !orgNameInput.trim()}
                    >
                      {savingOrgName ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex' }}>
            <Card variant="outlined" sx={{ backgroundColor: '#2C2C2C', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1 }}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Give access to another user
                  </Typography>

                  <TextField
                    label="User Email"
                    value={grantEmail}
                    onChange={(e) => setGrantEmail(e.target.value)}
                    fullWidth
                    placeholder="name@company.com"
                  />

                  <TextField
                    select
                    label="Role"
                    value={grantRole}
                    onChange={(e) => setGrantRole(e.target.value as 'admin' | 'member' | 'viewer')}
                    fullWidth
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="member">Member</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </TextField>

                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleGrantAccess}
                      disabled={granting || !grantEmail.trim()}
                    >
                      {granting ? 'Granting...' : 'Grant Access'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card variant="outlined" sx={{ backgroundColor: '#2C2C2C', borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Users with access
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Granted At</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Granted By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.userId} hover>
                      <TableCell>{m.email}</TableCell>
                      <TableCell>{m.role}</TableCell>
                      <TableCell>{m.grantedAt ? new Date(m.grantedAt).toLocaleString() : '-'}</TableCell>
                      <TableCell>{m.grantedByEmail || '-'}</TableCell>
                    </TableRow>
                  ))}

                  {members.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No additional users have been granted access yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}
