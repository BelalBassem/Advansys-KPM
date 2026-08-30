namespace Application.Lessons.DTOs;

public class LessonDTO
{
    public string Title { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int FunctionId { get; set; }
    public int IndustryId { get; set; }
    public string ValueProposition { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string PersonToContact { get; set; } = string.Empty;
    public DateTime CreationDate { get; set; }
}
