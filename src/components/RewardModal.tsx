import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { X, Plus, Trash2, Upload } from 'lucide-react'
import { createReward, uploadImage } from '../services/firebaseService'
import { formatDateForStorage } from '../utils/dateUtils'
import dayjs from 'dayjs'

interface RewardModalProps {
  open: boolean
  onClose: () => void
  onSave: (rewardData: any) => void
  editingReward?: any
}

const RewardModal = ({ open, onClose, onSave, editingReward }: RewardModalProps) => {
  const [formData, setFormData] = useState({
    brandName: '',
    deductPoints: '',
    maxPerUser: '',
    availableCoupons: '',
    fullImage: '',
    fullImageGreyed: '',
    previewImage: '',
    previewImageGreyed: '',
    rewardSubtitle: '',
    rewardTitle: '',
    rewardType: 'discount',
    status: 'available',
    usefulnessScore: '',
    validFrom: dayjs(),
    validTo: dayjs().add(30, 'day'),
    rewardDetails: [''],
    howToClaim: ['']
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null)
  const [fullImageFile, setFullImageFile] = useState<File | null>(null)

  // Populate form when editingReward is provided
  useEffect(() => {
    if (editingReward) {
      setFormData({
        brandName: editingReward.brandName || '',
        deductPoints: editingReward.deductPoints?.toString() || '',
        maxPerUser: editingReward.maxPerUser?.toString() || '',
        availableCoupons: editingReward.availableCoupons || '',
        fullImage: editingReward.fullImage || '',
        fullImageGreyed: editingReward.fullImageGreyed || '',
        previewImage: editingReward.previewImage || '',
        previewImageGreyed: editingReward.previewImageGreyed || '',
        rewardSubtitle: editingReward.rewardSubtitle || '',
        rewardTitle: editingReward.rewardTitle || '',
        rewardType: editingReward.rewardType || 'discount',
        status: editingReward.status || 'available',
        usefulnessScore: editingReward.usefulnessScore?.toString() || '',
        validFrom: editingReward.validFrom ? dayjs(editingReward.validFrom) : dayjs(),
        validTo: editingReward.validTo ? dayjs(editingReward.validTo) : dayjs().add(30, 'day'),
        rewardDetails: editingReward.rewardDetails || [''],
        howToClaim: editingReward.howToClaim || ['']
      })
    } else {
      // Reset form for new reward
      setFormData({
        brandName: '',
        deductPoints: '',
        maxPerUser: '',
        availableCoupons: '',
        fullImage: '',
        fullImageGreyed: '',
        previewImage: '',
        previewImageGreyed: '',
        rewardSubtitle: '',
        rewardTitle: '',
        rewardType: 'discount',
        status: 'available',
        usefulnessScore: '',
        validFrom: dayjs(),
        validTo: dayjs().add(30, 'day'),
        rewardDetails: [''],
        howToClaim: ['']
      })
    }
  }, [editingReward])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'rewardDetails' | 'howToClaim', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'rewardDetails' | 'howToClaim') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field: 'rewardDetails' | 'howToClaim', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Upload images if files are selected
      let previewImageUrl = formData.previewImage
      let fullImageUrl = formData.fullImage
      
      if (previewImageFile) {
        const uploadResult = await uploadImage(previewImageFile, 'preview-images')
        if (uploadResult.success && uploadResult.url) {
          previewImageUrl = uploadResult.url
        } else {
          throw new Error(uploadResult.message)
        }
      }
      
      if (fullImageFile) {
        const uploadResult = await uploadImage(fullImageFile, 'full-images')
        if (uploadResult.success && uploadResult.url) {
          fullImageUrl = uploadResult.url
        } else {
          throw new Error(uploadResult.message)
        }
      }
      
      // Prepare reward data
      const rewardData = {
        brandName: formData.brandName,
        deductPoints: parseInt(formData.deductPoints) || 0,
        maxPerUser: parseInt(formData.maxPerUser) || 1,
        availableCoupons: formData.availableCoupons || "0",
        fullImage: fullImageUrl,
        fullImageGreyed: fullImageUrl, // For now, use same image
        previewImage: previewImageUrl,
        previewImageGreyed: previewImageUrl, // For now, use same image
        rewardSubtitle: formData.rewardSubtitle,
        rewardTitle: formData.rewardTitle,
        rewardType: formData.rewardType,
        status: formData.status,
        usefulnessScore: parseFloat(formData.usefulnessScore) || 0,
        validFrom: formatDateForStorage(formData.validFrom),
        validTo: formatDateForStorage(formData.validTo),
        rewardDetails: formData.rewardDetails.filter(item => item.trim() !== ''),
        howToClaim: formData.howToClaim.filter(item => item.trim() !== ''),
        likeCount: 0,
        dislikeCount: 0
      }
      
      // Save to Firebase
      const result = await createReward(rewardData)
      
      if (result.success) {
        onSave(rewardData)
        onClose()
        // Reset form
        setFormData({
          brandName: '',
          deductPoints: '',
          maxPerUser: '',
          availableCoupons: '',
          fullImage: '',
          fullImageGreyed: '',
          previewImage: '',
          previewImageGreyed: '',
          rewardSubtitle: '',
          rewardTitle: '',
          rewardType: 'discount',
          status: 'available',
          usefulnessScore: '',
          validFrom: dayjs(),
          validTo: dayjs().add(30, 'day'),
          rewardDetails: [''],
          howToClaim: ['']
        })
        setPreviewImageFile(null)
        setFullImageFile(null)
      } else {
        throw new Error(result.message)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create reward')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (type: 'preview' | 'full', file: File) => {
    if (type === 'preview') {
      setPreviewImageFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, previewImage: previewUrl }))
    } else {
      setFullImageFile(file)
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, fullImage: previewUrl }))
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 800,
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        overflow: 'auto'
      }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" p={3} borderBottom={1} borderColor="divider">
          <Typography variant="h5" fontWeight="bold">
            {editingReward ? 'Edit Reward' : 'Create New Reward'}
          </Typography>
          <IconButton onClick={onClose}>
            <X />
          </IconButton>
        </Stack>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          {/* Basic Information */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Basic Information
          </Typography>

          {/* ✅ FIXED: size={{}} + NO item prop */}
          <Grid container spacing={3} mb={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Brand Name"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Reward Title"
                value={formData.rewardTitle}
                onChange={(e) => handleInputChange('rewardTitle', e.target.value)}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Reward Subtitle"
                value={formData.rewardSubtitle}
                onChange={(e) => handleInputChange('rewardSubtitle', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Points and Limits */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Points & Limits
          </Typography>

          <Grid container spacing={3} mb={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Points to Deduct"
                value={formData.deductPoints}
                onChange={(e) => handleInputChange('deductPoints', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Max Per User"
                value={formData.maxPerUser}
                onChange={(e) => handleInputChange('maxPerUser', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Usefulness Score"
                value={formData.usefulnessScore}
                onChange={(e) => handleInputChange('usefulnessScore', e.target.value)}
              />
            </Grid>
          </Grid>

          {/* Type and Status */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Type & Status
          </Typography>

          <Grid container spacing={3} mb={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Reward Type</InputLabel>
                <Select
                  value={formData.rewardType}
                  onChange={(e) => handleInputChange('rewardType', e.target.value as string)}
                  label="Reward Type"
                >
                  <MenuItem value="coupon">Coupon</MenuItem>
                  <MenuItem value="voucher">Voucher</MenuItem>
                  <MenuItem value="cashback">Cashback</MenuItem>
                  <MenuItem value="discount">Discount</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as string)}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Validity Period */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Validity Period
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3} mb={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  label="Valid From"
                  value={formData.validFrom}
                  onChange={(newValue) => handleInputChange('validFrom', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  label="Valid To"
                  value={formData.validTo}
                  onChange={(newValue) => handleInputChange('validTo', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>

          {/* Image Upload */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Images
          </Typography>

          <Grid container spacing={3} mb={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.04)' },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => document.getElementById('preview-image-input')?.click()}
              >
                <input
                  id="preview-image-input"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('preview', file);
                  }}
                />
                <Upload size={40} color="#666" />
                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                  {previewImageFile ? previewImageFile.name : 'Click to upload preview image'}
                </Typography>
                {formData.previewImage && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={formData.previewImage}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '8px' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.04)' },
                  transition: 'all 0.2s ease'
                }}
                onClick={() => document.getElementById('full-image-input')?.click()}
              >
                <input
                  id="full-image-input"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload('full', file);
                  }}
                />
                <Upload size={40} color="#666" />
                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                  {fullImageFile ? fullImageFile.name : 'Click to upload full image'}
                </Typography>
                {formData.fullImage && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={formData.fullImage}
                      alt="Full"
                      style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '8px' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Dynamic Arrays - UNCHANGED */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Reward Details
          </Typography>

          <Box mb={3}>
            {formData.rewardDetails.map((detail, index) => (
              <Stack direction="row" spacing={2} mb={2} key={index}>
                <TextField
                  fullWidth
                  label={`Detail ${index + 1}`}
                  value={detail}
                  onChange={(e) => handleArrayChange('rewardDetails', index, e.target.value)}
                />
                {formData.rewardDetails.length > 1 && (
                  <IconButton
                    onClick={() => removeArrayItem('rewardDetails', index)}
                    color="error"
                  >
                    <Trash2 size={20} />
                  </IconButton>
                )}
              </Stack>
            ))}
            <Button
              startIcon={<Plus size={20} />}
              onClick={() => addArrayItem('rewardDetails')}
              variant="outlined"
            >
              Add Detail
            </Button>
          </Box>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            How to Claim
          </Typography>

          <Box mb={3}>
            {formData.howToClaim.map((step, index) => (
              <Stack direction="row" spacing={2} mb={2} key={index}>
                <TextField
                  fullWidth
                  label={`Step ${index + 1}`}
                  value={step}
                  onChange={(e) => handleArrayChange('howToClaim', index, e.target.value)}
                />
                {formData.howToClaim.length > 1 && (
                  <IconButton
                    onClick={() => removeArrayItem('howToClaim', index)}
                    color="error"
                  >
                    <Trash2 size={20} />
                  </IconButton>
                )}
              </Stack>
            ))}
            <Button
              startIcon={<Plus size={20} />}
              onClick={() => addArrayItem('howToClaim')}
              variant="outlined"
            >
              Add Step
            </Button>
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Box mb={2}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}

        {/* Footer Actions */}
        <Divider />
        <Stack direction="row" spacing={2} justifyContent="flex-end" p={3}>
          <Button onClick={onClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? (editingReward ? 'Updating...' : 'Creating...') : (editingReward ? 'Update Reward' : 'Create Reward')}
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default RewardModal
