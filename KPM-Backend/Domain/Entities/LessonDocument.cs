namespace Domain.Entities;

public class LessonDocument
{
    public int Id { get; set; }
    public Guid LessonId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;

    public Lesson Lesson { get; set; } = null!;
}
