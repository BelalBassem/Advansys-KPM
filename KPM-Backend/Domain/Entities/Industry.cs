namespace Domain.Entities;

public class Industry
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public DateTime ModifiedDate { get; set; }

    public ICollection<Lesson> Lesson{get;set;} = new List<Lesson>();
}
