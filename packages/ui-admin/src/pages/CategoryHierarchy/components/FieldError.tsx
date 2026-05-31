import { Typography } from '@ecom/core-ui/atoms/Typography'

interface FieldErrorProps {
  id?: string | undefined
  message?: string | undefined
}

export function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null

  return (
    <Typography id={id} variant="body-sm" className="text-destructive" role="alert">
      {message}
    </Typography>
  )
}
