namespace Domain.Entities;

public class Lesson
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int FunctionId { get; set; }
    public int IndustryId { get; set; }
    public string ValueProposition { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string PersonToContact { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }

    public Department Department {get;set;} = null!;
    public Function Function {get;set;} = null!;
    public Industry Industry {get;set;} = null!;
}
