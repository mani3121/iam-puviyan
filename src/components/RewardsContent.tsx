import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Grid,
  Pagination,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton
} from '@mui/material'

import { Search, Plus, Gift, CheckCircle, Clock, AlertCircle, Edit } from 'lucide-react'
import RewardModal from './RewardModal'
import { fetchRewardsPaginated, fetchRewardsStats, type Reward, type PaginatedRewardsResult } from '../services/firebaseService'

// Create a custom theme with enhanced scrollbar
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2a2a2a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#4CAF50 #2a2a2a',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#2a2a2a',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#4CAF50',
            borderRadius: '4px',
            '&:hover': {
              background: '#66BB6A',
            },
          },
        },
      },
    },
  },
})

const RewardsContent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [statsData, setStatsData] = useState({
    totalRewards: 0,
    totalClaimed: 0,
    totalUnclaimed: 0,
    totalExpiring: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
    const [lastVisible, setLastVisible] = useState<any>(null)
  const [totalRewardsCount, setTotalRewardsCount] = useState(0)
  const pageSize = 10

  // Fetch rewards and stats from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log('Starting to fetch data...')
        const [rewardsResult, statsData] = await Promise.all([
          fetchRewardsPaginated(pageSize),
          fetchRewardsStats()
        ])
        console.log('Data fetched:', { rewardsResult, statsData })
        setRewards(rewardsResult.rewards)
                setLastVisible(rewardsResult.lastVisible)
        setStatsData(statsData)
        setTotalRewardsCount(statsData.totalRewards)
        setError('')
      } catch (err) {
        console.error('Error fetching rewards data:', err)
        setError('Failed to load rewards data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to fetch a specific page
  const fetchPage = async (page: number) => {
    try {
      setLoading(true)
      let rewardsResult: PaginatedRewardsResult | undefined
      
      if (page === 1) {
        // First page - no lastVisible
        rewardsResult = await fetchRewardsPaginated(pageSize)
        setLastVisible(rewardsResult.lastVisible)
      } else {
        // For simplicity, we'll fetch from the beginning for now
        // In a real app, you might want to cache previous pages
        let currentLastVisible: any = null
        let hasMoreData = true
        
        // Fetch pages until we reach the desired page
        for (let i = 1; i <= page && hasMoreData; i++) {
          const result = await fetchRewardsPaginated(pageSize, currentLastVisible)
          if (i === page) {
            rewardsResult = result
          }
          currentLastVisible = result.lastVisible
          hasMoreData = result.hasMore
        }
      }
      
      if (rewardsResult) {
        setRewards(rewardsResult.rewards)
                setCurrentPage(page)
      }
    } catch (err) {
      console.error('Error fetching page:', err)
      setError('Failed to load page. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Function to handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalRewardsCount / pageSize)) {
      fetchPage(newPage)
    }
  }

  // Function to refresh data (useful after creating new rewards)
  const refreshData = async () => {
    setCurrentPage(1)
    setLastVisible(null)
    const fetchData = async () => {
      try {
        setLoading(true)
        const [rewardsResult, statsData] = await Promise.all([
          fetchRewardsPaginated(pageSize),
          fetchRewardsStats()
        ])
        setRewards(rewardsResult.rewards)
                setLastVisible(rewardsResult.lastVisible)
        setStatsData(statsData)
        setTotalRewardsCount(statsData.totalRewards)
        setError('')
      } catch (err) {
        console.error('Error refreshing rewards data:', err)
        setError('Failed to refresh rewards data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }

  // Update handleCreateReward to refresh data after creation
  const handleCreateReward = (rewardData: any) => {
    console.log('New reward created:', rewardData)
    refreshData()
  }

  // Handle edit reward
  const handleEdit = (reward: Reward) => {
    setEditingReward(reward)
    setIsModalOpen(true)
  }

  // Handle update reward
  const handleUpdateReward = (rewardData: any) => {
    console.log('Reward updated:', rewardData)
    refreshData()
    setEditingReward(null)
  }

  // Filter rewards based on search term (applied to current page data)
  const filteredRewards = rewards.filter(reward =>
    reward.rewardTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reward.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return '#4CAF50'
      case 'claimed': return '#2196F3'
      case 'expired': return '#F44336'
      case 'active': return '#4CAF50'
      case 'inactive': return '#FF9800'
      default: return '#666'
    }
  }

  
  const StatCard = ({ icon: Icon, title, value, color }: { 
    icon: any, 
    title: string, 
    value: number, 
    color: string 
  }) => (
    <Card 
      variant="outlined"
      sx={{ 
        backgroundColor: 'background.paper',
        borderColor: 'divider',
        '&:hover': { 
          backgroundColor: 'action.hover',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Box sx={{ color }}>
            <Icon size={24} />
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            {title}
          </Typography>
        </Stack>
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold' }}>
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <Typography variant="h4" sx={{ mb: 4, color: '#ffffff', fontWeight: 'bold' }}>
          Rewards Management
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress sx={{ color: '#4CAF50' }} />
          </Box>
        )}

        {error && !loading && (
          <Alert severity="error" sx={{ mb: 4, backgroundColor: '#2a2a2a', color: '#ffffff' }}>
            {error}
          </Alert>
        )}

      {!loading && !error && (
        <>
          {/* ✅ FIXED: Use size={{}} instead of xs={} */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard 
                icon={Gift} 
                title="Total Rewards" 
                value={statsData.totalRewards} 
                color="#4CAF50" 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard 
                icon={CheckCircle} 
                title="Total Rewards Claimed" 
                value={statsData.totalClaimed} 
                color="#2196F3" 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard 
                icon={Clock} 
                title="Rewards Yet to Claim" 
                value={statsData.totalUnclaimed} 
                color="#FF9800" 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard 
                icon={AlertCircle} 
                title="Expired Rewards" 
                value={statsData.totalExpiring} 
                color="#F44336" 
              />
            </Grid>
          </Grid>

          {/* Rest of your code remains unchanged */}
          <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
            <TextField
              placeholder="Search rewards..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: 300 }}
              slotProps={{
                input: {
                  startAdornment: <Search size={20} style={{ marginRight: 8 }} />
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => {
                setEditingReward(null)
                setIsModalOpen(true)
              }}
            >
              Create a Reward
            </Button>
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Reward Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Points</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRewards.map((reward) => (
                  <TableRow key={reward.id} hover>
                    <TableCell>{reward.rewardTitle}</TableCell>
                    <TableCell>{reward.brandName}</TableCell>
                    <TableCell>{reward.deductPoints}</TableCell>
                    <TableCell>
                      <Chip
                        label={reward.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(reward.status) + '20',
                          color: getStatusColor(reward.status),
                          fontWeight: 'medium'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(reward)}
                        color="primary"
                      >
                        <Edit size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRewards.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No rewards found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {rewards.length} of {totalRewardsCount} rewards
            </Typography>
            <Pagination
              count={Math.ceil(totalRewardsCount / pageSize)}
              page={currentPage}
              onChange={(_, newPage) => handlePageChange(newPage)}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
              disabled={loading}
            />
          </Box>

          <RewardModal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditingReward(null)
            }}
            onSave={editingReward ? handleUpdateReward : handleCreateReward}
            editingReward={editingReward}
          />
        </>
      )}
    </Box>
    </ThemeProvider>
  )
}

export default RewardsContent
