namespace Domain.Entities;

public class LessonKeyword
{
    public int Id { get; set; }
    public Guid LessonId { get; set; }
    public string Name { get; set; } = string.Empty;

    public Lesson Lesson { get; set; } = null!;
}
