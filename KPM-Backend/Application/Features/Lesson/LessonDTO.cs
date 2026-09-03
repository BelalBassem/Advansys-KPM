namespace Application.Lessons.DTOs;

public class LessonDTO
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int FunctionId { get; set; }
    public int IndustryId { get; set; }
    public Guid PersonToContactId { get; set; }
    public LessonContactDTO? PersonToContact { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> Links { get; set; } = new List<string>();
    public List<string> Keywords { get; set; } = new List<string>();
    public List<LessonDocumentDTO> Documents { get; set; } = new List<LessonDocumentDTO>();
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }
}

public class LessonRequest
{
    public string Title { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int FunctionId { get; set; }
    public int IndustryId { get; set; }
    public Guid PersonToContactId { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public List<string> Links { get; set; } = new List<string>();
    public List<string> Keywords { get; set; } = new List<string>();
    public List<LessonDocumentRequest> Documents { get; set; } = new List<LessonDocumentRequest>();
}

public class LessonDocumentRequest
{
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
}

public class LessonDocumentDTO
{
    public int Id { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
}

public class LessonContactDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
