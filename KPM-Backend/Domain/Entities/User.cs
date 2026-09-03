namespace Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Name {get;set;} = String.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    public ICollection<Lesson> ContactLessons { get; set; } = new List<Lesson>();
}
