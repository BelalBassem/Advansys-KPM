namespace Domain.Entities;

public class Function
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime LastModifiedDate { get; set; }

    public ICollection<Lesson> Lesson {get;set;} = new List<Lesson>();
    public ICollection<DepartmentFunction> DepartmentFunction{get;set;} = new List<DepartmentFunction>();

}
