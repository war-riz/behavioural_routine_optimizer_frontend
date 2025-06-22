import { useState} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Activity, Brain, Target, TrendingUp, Users, CheckCircle, AlertCircle, Calendar, Zap, Moon, BarChart3} from 'lucide-react';
import { usePrediction, useFeedback, useModelStatus, useFormData } from './hooks/useApi';
import './Dashboard.css';

// Initial form data
const initialFormData = {
  Age: 25,
  Sleep_Hours: 7.5,
  Screen_Time: 6.0,
  Stress_Level: 5,
  Noise_Exposure: 3,
  Social_Interaction: 6,
  Work_Hours: 8.0,
  Exercise_Hours: 1.0,
  Caffeine_Intake: 2.0,
  Multitasking_Habit: 4,
  Anxiety_Score: 4,
  Depression_Score: 3,
  Sensory_Sensitivity: 4,
  Meditation_Habit: 3,
  Overthinking_Score: 5,
  Irritability_Score: 4,
  Headache_Frequency: 2,
  Sleep_Quality: 7,
  Tech_Usage_Hours: 8.0,
  Overstimulated: 4
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('predict');
  const [feedbackData, setFeedbackData] = useState({
    accepted: '',
    user_feedback: '',
    final_score: 0
  });

  // Use your custom hooks
  const { prediction, explanation, loading: predictionLoading, error: predictionError, predict } = usePrediction();
  const { feedbackStats, submitFeedback } = useFeedback();
  const { status: modelStatus } = useModelStatus();
  const { formData, errors, updateField, validateForm, resetForm } = useFormData(initialFormData);

  const handlePredict = async () => {
    if (validateForm()) {
      try {
        await predict(formData);
      } catch (error) {
        console.error('Prediction failed:', error);
      }
    }
  };

  const handleFeedbackSubmit = async () => {
    if (prediction && feedbackData.accepted && feedbackData.final_score > 0) {
      try {
        await submitFeedback({
          user_id: prediction.user_id,
          predicted_productivity_score: prediction.predicted_productivity_score,
          ...feedbackData
        });
        setFeedbackData({ accepted: '', user_feedback: '', final_score: 0 });
        alert('Feedback submitted successfully!');
      } catch (error) {
        console.error('Feedback submission failed:', error);
        alert('Failed to submit feedback');
      }
    }
  };

  const formatExplanationData = (explanation) => {
    if (!explanation) return [];
    return explanation.map(item => ({
      feature: item.feature.replace('_', ' '),
      impact: Math.abs(item.impact),
      positive: item.impact > 0
    }));
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <Brain className="header-icon" />
            <h1>Behavioral Routine Optimizer</h1>
          </div>
          <div className="model-status">
            <div className={`status-indicator ${modelStatus?.model_loaded ? 'online' : 'offline'}`}>
              {modelStatus?.model_loaded ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{modelStatus?.model_loaded ? 'Model Online' : 'Model Offline'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'predict' ? 'active' : ''}`}
          onClick={() => setActiveTab('predict')}
        >
          <Target size={20} />
          Predict
        </button>
        <button 
          className={`nav-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          disabled={!prediction}
        >
          <BarChart3 size={20} />
          Results
        </button>
        <button 
          className={`nav-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
          disabled={!prediction}
        >
          <Users size={20} />
          Feedback
        </button>
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <TrendingUp size={20} />
          Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Predict Tab */}
        {activeTab === 'predict' && (
          <div className="predict-section">
            <div className="section-header">
              <h2>Input Your Daily Metrics</h2>
              <p>Fill in your daily routine information to get personalized productivity insights</p>
            </div>

            <div className="form-grid">
              {/* Personal Info */}
              <div className="form-group">
                <h3>Personal Information</h3>
                <div className="input-row">
                  <div className="input-field">
                    <label>Age</label>
                    <input
                      type="number"
                      value={formData.Age}
                      onChange={(e) => updateField('Age', parseInt(e.target.value))}
                      min="18"
                      max="80"
                    />
                    {errors.Age && <span className="error">{errors.Age}</span>}
                  </div>
                </div>
              </div>

              {/* Sleep & Time */}
              <div className="form-group">
                <h3><Moon size={18} /> Sleep & Time</h3>
                <div className="input-row">
                  <div className="input-field">
                    <label>Sleep Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.Sleep_Hours}
                      onChange={(e) => updateField('Sleep_Hours', parseFloat(e.target.value))}
                      min="4"
                      max="12"
                    />
                  </div>
                  <div className="input-field">
                    <label>Sleep Quality (1-10)</label>
                    <input
                      type="range"
                      value={formData.Sleep_Quality}
                      onChange={(e) => updateField('Sleep_Quality', parseInt(e.target.value))}
                      min="1"
                      max="10"
                      className="slider"
                    />
                    <span className="slider-value">{formData.Sleep_Quality}</span>
                  </div>
                </div>
              </div>

              {/* Work & Productivity */}
              <div className="form-group">
                <h3><Activity size={18} /> Work & Activity</h3>
                <div className="input-row">
                  <div className="input-field">
                    <label>Work Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.Work_Hours}
                      onChange={(e) => updateField('Work_Hours', parseFloat(e.target.value))}
                      min="0"
                      max="16"
                    />
                  </div>
                  <div className="input-field">
                    <label>Exercise Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.Exercise_Hours}
                      onChange={(e) => updateField('Exercise_Hours', parseFloat(e.target.value))}
                      min="0"
                      max="8"
                    />
                  </div>
                </div>
              </div>

              {/* Technology Usage */}
              <div className="form-group">
                <h3><Zap size={18} /> Technology</h3>
                <div className="input-row">
                  <div className="input-field">
                    <label>Screen Time (hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.Screen_Time}
                      onChange={(e) => updateField('Screen_Time', parseFloat(e.target.value))}
                      min="0"
                      max="24"
                    />
                  </div>
                  <div className="input-field">
                    <label>Tech Usage Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.Tech_Usage_Hours}
                      onChange={(e) => updateField('Tech_Usage_Hours', parseFloat(e.target.value))}
                      min="0"
                      max="24"
                    />
                  </div>
                </div>
              </div>

              {/* Mental Health & Habits */}
              <div className="form-group">
                <h3><Brain size={18} /> Mental Health</h3>
                <div className="input-grid">
                  {[
                    { key: 'Stress_Level', label: 'Stress Level' },
                    { key: 'Anxiety_Score', label: 'Anxiety Score' },
                    { key: 'Depression_Score', label: 'Depression Score' },
                    { key: 'Overthinking_Score', label: 'Overthinking Score' },
                    { key: 'Irritability_Score', label: 'Irritability Score' },
                    { key: 'Meditation_Habit', label: 'Meditation Habit' }
                  ].map(field => (
                    <div key={field.key} className="input-field">
                      <label>{field.label} (1-10)</label>
                      <input
                        type="range"
                        value={formData[field.key]}
                        onChange={(e) => updateField(field.key, parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="slider"
                      />
                      <span className="slider-value">{formData[field.key]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environmental & Social */}
              <div className="form-group">
                <h3>Environment & Social</h3>
                <div className="input-grid">
                  {[
                    { key: 'Noise_Exposure', label: 'Noise Exposure' },
                    { key: 'Social_Interaction', label: 'Social Interaction' },
                    { key: 'Sensory_Sensitivity', label: 'Sensory Sensitivity' },
                    { key: 'Multitasking_Habit', label: 'Multitasking Habit' },
                    { key: 'Headache_Frequency', label: 'Headache Frequency' },
                    { key: 'Overstimulated', label: 'Overstimulated' }
                  ].map(field => (
                    <div key={field.key} className="input-field">
                      <label>{field.label} (1-10)</label>
                      <input
                        type="range"
                        value={formData[field.key]}
                        onChange={(e) => updateField(field.key, parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="slider"
                      />
                      <span className="slider-value">{formData[field.key]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle */}
              <div className="form-group">
                <h3>Lifestyle</h3>
                <div className="input-row">
                  <div className="input-field">
                    <label>Caffeine Intake (cups)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.Caffeine_Intake}
                      onChange={(e) => updateField('Caffeine_Intake', parseFloat(e.target.value))}
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="predict-actions">
              <button 
                className="btn-secondary" 
                onClick={resetForm}
                disabled={predictionLoading}
              >
                Reset Form
              </button>
              <button 
                className="btn-primary" 
                onClick={handlePredict}
                disabled={predictionLoading}
              >
                {predictionLoading ? 'Analyzing...' : 'Get Prediction'}
              </button>
            </div>

            {predictionError && (
              <div className="error-message">
                <AlertCircle size={20} />
                <span>{predictionError}</span>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && prediction && (
          <div className="results-section">
            <div className="section-header">
              <h2>Your Productivity Analysis</h2>
              <p>Based on your inputs, here's your personalized productivity insights</p>
            </div>

            {/* Productivity Score */}
            <div className="score-card">
              <div className="score-circle">
                <div className="score-value">{prediction.predicted_productivity_score}%</div>
                <div className="score-label">Predicted Productivity Score</div>
              </div>
            </div>

            {/* SHAP Explanation */}
            {explanation && (
              <div className="explanation-section">
                <h3>SHAP Feature Importance</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={formatExplanationData(explanation.explanation?.all_factors || explanation)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="feature" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="impact" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Routine Recommendations */}
            <div className="routine-section">
              <h3><Calendar size={20} /> Personalized Routine Recommendations</h3>
              <div className="routine-timeline">
                {prediction.personalized_recommendation?.map((item, index) => (
                  <div key={index} className="routine-item">
                    <div className="routine-time">{item.time}</div>
                    <div className="routine-task">{item.task}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && prediction && (
          <div className="feedback-section">
            <div className="section-header">
              <h2>Provide Feedback</h2>
              <p>Help us improve by sharing your actual experience</p>
            </div>

            <div className="feedback-form">
              <div className="feedback-summary">
                <h3>Prediction Summary</h3>
                <p>User ID: <strong>{prediction.user_id}</strong></p>
                <p>Predicted Score: <strong>{prediction.predicted_productivity_score}%</strong></p>
              </div>

              <div className="form-group">
                <label>Did you find the prediction helpful?</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="yes"
                      checked={feedbackData.accepted === 'yes'}
                      onChange={(e) => setFeedbackData({...feedbackData, accepted: e.target.value})}
                    />
                    <span>Yes, it was helpful</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="neutral"
                      checked={feedbackData.accepted === 'neutral'}
                      onChange={(e) => setFeedbackData({...feedbackData, accepted: e.target.value})}
                    />
                    <span>It was okay</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="no"
                      checked={feedbackData.accepted === 'no'}
                      onChange={(e) => setFeedbackData({...feedbackData, accepted: e.target.value})}
                    />
                    <span>No, it wasn't helpful</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>What was your actual productivity score? (0-100)</label>
                <input
                  type="range"
                  value={feedbackData.final_score}
                  onChange={(e) => setFeedbackData({...feedbackData, final_score: parseInt(e.target.value)})}
                  min="0"
                  max="100"
                  className="slider"
                />
                <span className="slider-value">{feedbackData.final_score}%</span>
              </div>

              <div className="form-group">
                <label>Additional Comments (Optional)</label>
                <textarea
                  value={feedbackData.user_feedback}
                  onChange={(e) => setFeedbackData({...feedbackData, user_feedback: e.target.value})}
                  placeholder="Share your experience, what worked, what didn't..."
                  rows="4"
                />
              </div>

              <button 
                className="btn-primary" 
                onClick={handleFeedbackSubmit}
                disabled={!feedbackData.accepted || feedbackData.final_score === 0}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="stats-section">
            <div className="section-header">
              <h2>System Dashboard</h2>
              <p>Overview of system performance and user feedback</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{feedbackStats?.total_feedback || 0}</div>
                  <div className="stat-label">Total Feedback</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <CheckCircle />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{feedbackStats?.accepted_count || 0}</div>
                  <div className="stat-label">Positive Feedback</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Target />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{feedbackStats?.avg_predicted_score || 0}%</div>
                  <div className="stat-label">Avg Predicted Score</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{feedbackStats?.avg_final_score || 0}%</div>
                  <div className="stat-label">Avg Actual Score</div>
                </div>
              </div>
            </div>

            {feedbackStats && feedbackStats.total_feedback > 0 && (
              <div className="feedback-chart">
                <h3>Feedback Distribution</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Helpful', value: feedbackStats.accepted_count, color: '#10B981' },
                          { name: 'Neutral', value: feedbackStats.neutral_count, color: '#F59E0B' },
                          { name: 'Not Helpful', value: feedbackStats.rejected_count, color: '#EF4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {[
                          { name: 'Helpful', value: feedbackStats.accepted_count, color: '#10B981' },
                          { name: 'Neutral', value: feedbackStats.neutral_count, color: '#F59E0B' },
                          { name: 'Not Helpful', value: feedbackStats.rejected_count, color: '#EF4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;