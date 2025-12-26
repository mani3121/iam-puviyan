import { Box, Card, CardContent, Stack, Typography } from '@mui/material'

export default function RewardsRedemptionsChart() {
  const now = new Date()
  const sampleValues = [12, 18, 9, 22, 14, 26, 20]
  const sampleData = sampleValues.map((value, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' })
    const dateLabel = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
    return {
      label: dayLabel,
      dateLabel,
      value
    }
  })

  const maxValue = Math.max(...sampleData.map(d => d.value), 1)

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: '#2C2C2C',
        borderColor: 'divider',
        overflow: 'visible',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={1.5} sx={{ minWidth: 0, height: '100%' }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
            Reward progress
          </Typography>

          <Box
            sx={{
              mt: 1,
              minHeight: 220,
              flex: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              px: 2,
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Redemptions (sample)
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Last 7 days
              </Typography>
            </Stack>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
              {sampleData.map((d) => (
                <Box key={`${d.label}-${d.dateLabel}`} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Box
                    sx={{
                      height: `${Math.round((d.value / maxValue) * 100)}%`,
                      minHeight: 6,
                      borderRadius: 1,
                      bgcolor: 'primary.main',
                      opacity: 0.9
                    }}
                    title={`${d.label} (${d.dateLabel}): ${d.value}`}
                  />
                  <Stack spacing={0}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.2 }}>
                      {d.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.2, opacity: 0.8 }}>
                      {d.dateLabel}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
