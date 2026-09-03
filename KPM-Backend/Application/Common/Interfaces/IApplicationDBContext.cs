using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IApplicationDBContext
{
    DbSet<Department> Department { get; }
    DbSet<DepartmentFunction> DepartmentFunction { get; }
    DbSet<Function> Function { get; }
    DbSet<Industry> Industry { get; }
    DbSet<Lesson> Lesson { get; }
    DbSet<LessonLink> LessonLink { get; }
    DbSet<LessonKeyword> LessonKeyword { get; }
    DbSet<LessonDocument> LessonDocument { get; }
    DbSet<User> User { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
