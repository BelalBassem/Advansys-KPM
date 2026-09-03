namespace Domain.Entities;

public class LessonLink
{
    public int Id { get; set; }
    public Guid LessonId { get; set; }
    public string Url { get; set; } = string.Empty;

    public Lesson Lesson { get; set; } = null!;
}
