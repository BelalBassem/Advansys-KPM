using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Application.Common.Interfaces;
namespace Infrastructure;

public class ApplicationDBContext : DbContext, IApplicationDBContext
{
    public DbSet<Department> Department {get;set;}
    public DbSet<DepartmentFunction> DepartmentFunction {get;set;}
    public DbSet<Function> Function {get;set;}
    public DbSet<Industry> Industry {get;set;}
    public DbSet<Lesson> Lesson{get;set;}
    public DbSet<LessonLink> LessonLink { get; set; }
    public DbSet<LessonKeyword> LessonKeyword { get; set; }
    public DbSet<LessonDocument> LessonDocument { get; set; }
    public DbSet<User> User {get;set;}

    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options) {}
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDBContext).Assembly);

    base.OnModelCreating(modelBuilder);
    }
}
