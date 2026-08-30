using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations;

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.ToTable("Department");

        builder.HasKey(department => department.Id);

        builder.Property(department => department.CreatedDate)
            .HasColumnType("datetime");

        builder.Property(department => department.ModifiedDate)
            .HasColumnType("datetime");
    }
}
