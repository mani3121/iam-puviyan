import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Upload, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createReward, uploadImage } from '../services/firebaseService'

interface RewardModalProps {
  open: boolean
  onClose: () => void
  onSave: (rewardData: any) => void
  onPublishSuccess?: () => void
  editingReward?: any
}

const RewardModal = ({ open, onClose, onSave, onPublishSuccess, editingReward }: RewardModalProps) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    brandName: '',
    availableCoupons: '',
    posterImage: '',
    rewardSubtitle: '',
    rewardTitle: '',
    usefulnessScore: '',
    rewardDetails: '',
    howToClaim: '',
    termsAndConditions: '',
    approverEmails: [] as string[]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [posterImageFile, setPosterImageFile] = useState<File | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Populate form when editingReward is provided
  useEffect(() => {
    if (editingReward) {
      setFormData({
        brandName: editingReward.brandName || '',
        availableCoupons: editingReward.availableCoupons || '',
        posterImage: editingReward.fullImage || editingReward.previewImage || '',
        rewardSubtitle: editingReward.rewardSubtitle || '',
        rewardTitle: editingReward.rewardTitle || '',
        usefulnessScore: editingReward.usefulnessScore?.toString() || '',
        rewardDetails: editingReward.rewardDetails?.[0] || '',
        howToClaim: editingReward.howToClaim?.[0] || '',
        termsAndConditions: editingReward.termsAndConditions?.[0] || '',
        approverEmails: editingReward.approverEmails || []
      })
    } else {
      // Reset form for new reward
      setFormData({
        brandName: '',
        availableCoupons: '',
        posterImage: '',
        rewardSubtitle: '',
        rewardTitle: '',
        usefulnessScore: '',
        rewardDetails: '',
        howToClaim: '',
        termsAndConditions: '',
        approverEmails: []
      })
    }
  }, [editingReward])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addApproverEmail = () => {
    if (emailInput && emailInput.includes('@') && formData.approverEmails.length < 10) {
      setFormData(prev => ({
        ...prev,
        approverEmails: [...prev.approverEmails, emailInput.trim()]
      }))
      setEmailInput('')
      setError('')
    } else if (!emailInput.includes('@')) {
      setError('Please enter a valid email address')
    } else if (formData.approverEmails.length >= 10) {
      setError('Maximum 10 approver emails allowed')
    }
  }

  const removeApproverEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      approverEmails: prev.approverEmails.filter((_, i) => i !== index)
    }))
  }

  const handlePublishReward = async () => {
    await handleSubmitWithStatus('active')
  }

  const handleSaveDraft = async () => {
    await handleSubmitWithStatus('draft')
  }

  const handleSubmitWithStatus = async (status: string) => {
    setLoading(true)
    setError('')
    
    try {
      // Upload poster image if file is selected
      let posterImageUrl = formData.posterImage
      
      if (posterImageFile) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if (!allowedTypes.includes(posterImageFile.type)) {
          throw new Error('Only JPG and PNG files are allowed')
        }
        
        // Validate aspect ratio (16:9)
        const aspectRatio = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve({ width: img.width, height: img.height })
          img.onerror = reject
          img.src = URL.createObjectURL(posterImageFile)
        })
        
        const ratio = aspectRatio.width / aspectRatio.height
        if (Math.abs(ratio - 16/9) > 0.01) { // Allow small tolerance
          throw new Error('Image must have 16:9 aspect ratio')
        }
        
        const uploadResult = await uploadImage(posterImageFile, 'poster-images')
        if (uploadResult.success && uploadResult.url) {
          posterImageUrl = uploadResult.url
        } else {
          throw new Error(uploadResult.message)
        }
      }
      
      // Prepare reward data
      const rewardData = {
        brandName: formData.brandName,
        availableCoupons: formData.availableCoupons,
        fullImage: posterImageUrl,
        fullImageGreyed: posterImageUrl,
        previewImage: posterImageUrl,
        previewImageGreyed: posterImageUrl,
        rewardSubtitle: formData.rewardSubtitle,
        rewardTitle: formData.rewardTitle,
        usefulnessScore: parseFloat(formData.usefulnessScore) || 0,
        rewardDetails: formData.rewardDetails ? [formData.rewardDetails] : [],
        howToClaim: formData.howToClaim ? [formData.howToClaim] : [],
        termsAndConditions: formData.termsAndConditions ? [formData.termsAndConditions] : [],
        approverEmails: formData.approverEmails,
        likeCount: 0,
        dislikeCount: 0,
        deductPoints: 0,
        maxPerUser: 1,
        rewardType: 'general',
        status: status, // Set status based on button clicked
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      // Save to Firebase
      const result = await createReward(rewardData)
      
      if (result.success) {
        onSave(rewardData)
        
        // If publishing successfully, show toast and redirect
        if (status === 'active') {
          // Show success toast
          setShowSuccessToast(true)
          
          // Call success callback if provided
          if (onPublishSuccess) {
            onPublishSuccess()
          }
          
          // Close modal immediately
          onClose()
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard')
          }, 1500)
        } else {
          // For draft, just close modal normally
          onClose()
        }
        
        // Reset form
        setFormData({
          brandName: '',
          availableCoupons: '',
          posterImage: '',
          rewardSubtitle: '',
          rewardTitle: '',
          usefulnessScore: '',
          rewardDetails: '',
          howToClaim: '',
          termsAndConditions: '',
          approverEmails: []
        })
        setPosterImageFile(null)
      } else {
        throw new Error(result.message)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create reward')
    } finally {
      setLoading(false)
    }
  }

  const handlePosterUpload = (file: File) => {
    setPosterImageFile(file)
    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setFormData(prev => ({ ...prev, posterImage: previewUrl }))
  }

  return (
    <Modal open={open} onClose={onClose}>
      <>
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

          {/* Upload Poster */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Upload Poster
          </Typography>

          <Box mb={3}>
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
              onClick={() => document.getElementById('poster-image-input')?.click()}
            >
              <input
                id="poster-image-input"
                type="file"
                accept=".jpg,.jpeg,.png"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePosterUpload(file);
                }}
              />
              <Upload size={40} color="#666" />
              <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                {posterImageFile ? posterImageFile.name : 'Click to upload poster (JPG/PNG, 16:9 aspect ratio)'}
              </Typography>
              {formData.posterImage && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={formData.posterImage}
                    alt="Poster"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </Box>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Only JPG and PNG files allowed. Image must have 16:9 aspect ratio.
            </Typography>
          </Box>

          {/* Reward Details */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Details
          </Typography>

          <Box mb={3}>
            <TextField
              fullWidth
              label="Details"
              value={formData.rewardDetails}
              onChange={(e) => handleInputChange('rewardDetails', e.target.value)}
              multiline
              rows={4}
              placeholder="Enter detailed information about the reward..."
            />
          </Box>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            How to Claim
          </Typography>

          <Box mb={3}>
            <TextField
              fullWidth
              label="How to Claim"
              value={formData.howToClaim}
              onChange={(e) => handleInputChange('howToClaim', e.target.value)}
              multiline
              rows={4}
              placeholder="Enter step-by-step instructions on how to claim this reward..."
            />
          </Box>

          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Terms and Conditions
          </Typography>

          <Box mb={3}>
            <TextField
              fullWidth
              label="Terms and Conditions"
              value={formData.termsAndConditions}
              onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
              multiline
              rows={4}
              placeholder="Enter terms and conditions for this reward..."
            />
          </Box>

          {/* Approver Emails */}
          <Typography variant="h6" fontWeight="bold" mt={3} mb={2}>
            Approver Emails
          </Typography>

          <Box mb={3}>
            <Stack direction="row" spacing={2} mb={2}>
              <TextField
                fullWidth
                label="Enter email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addApproverEmail()
                  }
                }}
                placeholder="Type email and press Enter"
              />
              <Button 
                onClick={addApproverEmail}
                variant="outlined"
                disabled={!emailInput || !emailInput.includes('@')}
              >
                Add
              </Button>
            </Stack>
            
            {/* Email Chips */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {formData.approverEmails.map((email, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    gap: 1
                  }}
                >
                  {email}
                  <IconButton
                    size="small"
                    onClick={() => removeApproverEmail(index)}
                    sx={{ color: 'inherit', padding: 0.5 }}
                  >
                    <X size={16} />
                  </IconButton>
                </Box>
              ))}
            </Box>
            
            {formData.approverEmails.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No approver emails added. Add 1-10 email addresses.
              </Typography>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {formData.approverEmails.length}/10 emails added
            </Typography>
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
          <Button onClick={onClose} variant="text" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDraft} 
            variant="outlined" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button 
            onClick={handlePublishReward} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Reward'}
          </Button>
        </Stack>
      </Box>
      
      {/* Success Toast */}
      <Snackbar
        open={showSuccessToast}
        autoHideDuration={3000}
        onClose={() => setShowSuccessToast(false)}
        message="Reward published successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbar-content': {
            backgroundColor: 'success.main',
            color: 'success.contrastText'
          }
        }}
      />
    </>
    </Modal>
  )
}

export default RewardModal
