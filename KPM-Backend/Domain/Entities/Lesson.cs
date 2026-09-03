namespace Domain.Entities;

public class Lesson
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int FunctionId { get; set; }
    public int IndustryId { get; set; }
    public Guid PersonToContactId { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }

    public Department Department {get;set;} = null!;
    public Function Function {get;set;} = null!;
    public Industry Industry {get;set;} = null!;
    public User PersonToContact { get; set; } = null!;
    public ICollection<LessonLink> Links { get; set; } = new List<LessonLink>();
    public ICollection<LessonKeyword> Keywords { get; set; } = new List<LessonKeyword>();
    public ICollection<LessonDocument> Documents { get; set; } = new List<LessonDocument>();
}
