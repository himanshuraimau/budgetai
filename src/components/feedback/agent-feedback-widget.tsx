"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ThumbsUp, 
  ThumbsDown, 
  Star,
  MessageSquare,
  Brain,
  Send,
  CheckCircle
} from "lucide-react"

interface AgentDecision {
  requestId: string
  agentId: string
  agentName: string
  decision: 'approve' | 'deny' | 'escalate'
  confidence: number
  reasoning: string
  amount?: number
  timestamp: string
}

interface FeedbackData {
  rating: 'positive' | 'negative' | null
  starRating: number
  comment: string
  improvementAreas: string[]
}

interface AgentFeedbackWidgetProps {
  decision: AgentDecision
  onFeedbackSubmit?: (feedback: FeedbackData) => void
  className?: string
}

export function AgentFeedbackWidget({ 
  decision, 
  onFeedbackSubmit,
  className = "" 
}: AgentFeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: null,
    starRating: 0,
    comment: '',
    improvementAreas: []
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingClick = (rating: 'positive' | 'negative') => {
    setFeedback(prev => ({
      ...prev,
      rating,
      starRating: rating === 'positive' ? 5 : 2
    }))
  }

  const handleStarClick = (rating: number) => {
    setFeedback(prev => ({
      ...prev,
      starRating: rating,
      rating: rating >= 4 ? 'positive' : 'negative'
    }))
  }

  const handleImprovementAreaToggle = (area: string) => {
    setFeedback(prev => ({
      ...prev,
      improvementAreas: prev.improvementAreas.includes(area)
        ? prev.improvementAreas.filter(a => a !== area)
        : [...prev.improvementAreas, area]
    }))
  }

  const handleSubmit = async () => {
    if (!feedback.rating) return

    setIsSubmitting(true)
    
    try {
      // Submit feedback to API
      const response = await fetch('/api/agents/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: decision.requestId,
          agentId: decision.agentId,
          feedback: feedback,
          decision: decision
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
        onFeedbackSubmit?.(feedback)
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approve': return 'text-green-600 bg-green-50'
      case 'deny': return 'text-red-600 bg-red-50'
      case 'escalate': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const improvementAreas = [
    'Decision accuracy',
    'Reasoning clarity',
    'Processing speed',
    'Risk assessment',
    'Communication',
    'Policy understanding'
  ]

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center gap-2">
                <span>Thank you for your feedback!</span>
                <Badge variant="outline">
                  AI Learning Updated
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Rate AI Decision
        </CardTitle>
        <CardDescription>
          Help improve our AI agents by rating this decision
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Decision Summary */}
        <div className="p-3 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{decision.agentName}</span>
            <Badge className={getDecisionColor(decision.decision)}>
              {decision.decision}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {decision.reasoning}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{decision.confidence}% confident</span>
            {decision.amount && <span>{formatCurrency(decision.amount)}</span>}
            <span>{new Date(decision.timestamp).toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Rating */}
        <div className="space-y-3">
          <h4 className="font-medium">How would you rate this decision?</h4>
          <div className="flex items-center gap-3">
            <Button
              variant={feedback.rating === 'positive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRatingClick('positive')}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Good Decision
            </Button>
            <Button
              variant={feedback.rating === 'negative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRatingClick('negative')}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Poor Decision
            </Button>
          </div>
        </div>

        {/* Star Rating */}
        <div className="space-y-2">
          <h4 className="font-medium">Overall rating</h4>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => handleStarClick(star)}
              >
                <Star 
                  className={`h-5 w-5 ${
                    star <= feedback.starRating 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              </Button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {feedback.starRating > 0 && `${feedback.starRating}/5`}
            </span>
          </div>
        </div>

        {/* Improvement Areas (shown for negative feedback) */}
        {feedback.rating === 'negative' && (
          <div className="space-y-2">
            <h4 className="font-medium">What could be improved?</h4>
            <div className="grid grid-cols-2 gap-2">
              {improvementAreas.map((area) => (
                <Button
                  key={area}
                  variant={feedback.improvementAreas.includes(area) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleImprovementAreaToggle(area)}
                  className="text-xs h-8"
                >
                  {area}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Comment */}
        <div className="space-y-2">
          <h4 className="font-medium">Additional comments (optional)</h4>
          <Textarea
            placeholder="Share any specific feedback or suggestions..."
            value={feedback.comment}
            onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={!feedback.rating || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 animate-pulse" />
              Submitting Feedback...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Feedback
            </div>
          )}
        </Button>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground text-center">
          Your feedback helps our AI agents learn and improve over time
        </div>
      </CardContent>
    </Card>
  )
}

// Simplified version for inline use
export function QuickFeedbackButtons({ 
  decision, 
  onFeedbackSubmit,
  className = "" 
}: AgentFeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleFeedback = async (rating: 'positive' | 'negative') => {
    setFeedback(rating)
    
    try {
      const response = await fetch('/api/agents/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: decision.requestId,
          agentId: decision.agentId,
          feedback: { 
            rating, 
            starRating: rating === 'positive' ? 5 : 2,
            comment: '',
            improvementAreas: []
          },
          decision: decision
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
        onFeedbackSubmit?.({ 
          rating, 
          starRating: rating === 'positive' ? 5 : 2,
          comment: '',
          improvementAreas: []
        })
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span>Thanks for your feedback!</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Was this helpful?</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback('positive')}
        className="h-8 px-2"
        disabled={feedback !== null}
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback('negative')}
        className="h-8 px-2"
        disabled={feedback !== null}
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>
    </div>
  )
} 