using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class LessonKeywordConfiguration : IEntityTypeConfiguration<LessonKeyword>
{
    public void Configure(EntityTypeBuilder<LessonKeyword> builder)
    {
        builder.ToTable("LessonKeyword");

        builder.HasKey(keyword => keyword.Id);

        builder.Property(keyword => keyword.Name)
            .HasMaxLength(100)
            .IsRequired();

        builder.HasOne(keyword => keyword.Lesson)
            .WithMany(lesson => lesson.Keywords)
            .HasForeignKey(keyword => keyword.LessonId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
