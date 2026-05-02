class BHPSLogic {
  // Calculate BHPS score for a single todo
  static calculate(todo) {
    const now = new Date();
    const deadline = new Date(todo.deadline);

    // Days until deadline
    const daysLeft = Math.max(0, (deadline - now) / (1000 * 60 * 60 * 24));

    // Urgency score, the closer the deadline, the higher the score
    const urgency = daysLeft === 0 ? 100 : Math.min(100, 100 / daysLeft);

    // Academic weight score (1-10 scale converted to 0-100)
    const weightScore = (todo.academic_weight / 10) * 100;

    // Effort score, higher effort = higher priority (1-10 scale converted to 0-100)
    const effortScore = (todo.estimated_effort / 10) * 100;

    // Final BHPS score (50% urgency, 30% academic weight, 20% effort)
    const bhpsScore = urgency * 0.5 + weightScore * 0.3 + effortScore * 0.2;

    return Math.round(bhpsScore * 100) / 100;
  }

  // Calculate and attach BHPS score to all todos, then sort by score
  static rankTodos(todos) {
    const scored = todos.map(todo => ({
      ...todo,
      bhps_score: this.calculate(todo),
      priority_label: this.getPriorityLabel(this.calculate(todo))
    }));

    // Sort by BHPS score descending (highest priority first)
    return scored.sort((a, b) => b.bhps_score - a.bhps_score);
  }

  // Get priority label based on score
  static getPriorityLabel(score) {
    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }
}

module.exports = BHPSLogic;