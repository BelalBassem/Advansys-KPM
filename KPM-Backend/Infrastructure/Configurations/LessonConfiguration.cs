using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.ToTable("Lesson");

        builder.HasKey(lesson => lesson.Id);

        builder.Property(lesson => lesson.Description)
            .HasColumnType("text");

        builder.Property(lesson => lesson.CreatedDate)
            .HasColumnType("datetime");

        builder.Property(lesson => lesson.ModifiedDate)
            .HasColumnType("datetime");

        builder.HasOne(lesson => lesson.Department)
            .WithMany(department => department.Lesson)
            .HasForeignKey(lesson => lesson.DepartmentId);

        builder.HasOne(lesson => lesson.Function)
            .WithMany(function => function.Lesson)
            .HasForeignKey(lesson => lesson.FunctionId);

        builder.HasOne(lesson => lesson.Industry)
            .WithMany(industry => industry.Lesson)
            .HasForeignKey(lesson => lesson.IndustryId);
    }
}
