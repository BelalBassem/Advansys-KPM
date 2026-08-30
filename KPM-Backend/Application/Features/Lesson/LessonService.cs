namespace Application.Features.Lesson;
using Domain.Entities;
using Application.Lessons.DTOs;
using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class LessonService
{
    private readonly IApplicationDBContext _context;
    private readonly ILogger<LessonService> _logger;
    public LessonService(IApplicationDBContext context, ILogger<LessonService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<LessonDTO?> getLesson(Guid id)
    {
        var returned = await _context.Lesson
        .Where(lesson => lesson.Id == id)
        .FirstOrDefaultAsync();

        return new LessonDTO
        {
            Title = returned.Title,
            ProjectName = returned.ProjectName,
            DepartmentId = returned.DepartmentId,
            FunctionId = returned.FunctionId,
            IndustryId = returned.IndustryId,
            ValueProposition = returned.ValueProposition,
            Description = returned.Description,
            ImageUrl = returned.ImageUrl,
            PersonToContact = returned.PersonToContact,
            CreationDate = returned.CreatedDate
        };
    }

    public async Task<Guid?> createLesson(
        string title,
        string projectName,
        int departmentId,
        int functionId,
        int industryId,
        string valueProposition,
        string description,
        string imageUrl,
        string personToContact)
    {
        var lesson = new Lesson
        {
            Title = title,
            ProjectName = projectName,
            DepartmentId = departmentId,
            FunctionId = functionId,
            IndustryId = industryId,
            ValueProposition = valueProposition,
            Description = description,
            ImageUrl = imageUrl,
            PersonToContact = personToContact,
            CreatedDate = DateTime.UtcNow,
            ModifiedDate = DateTime.UtcNow
        };

        await _context.Lesson.AddAsync(lesson);
        return lesson.Id;
    }

    public async Task<Guid?> updateLesson(
        Guid id,
        string title,
        string projectName,
        int departmentId,
        int functionId,
        int industryId,
        string valueProposition,
        string description,
        string imageUrl,
        string personToContact)
    {
        var lesson = await _context.Lesson.FirstOrDefaultAsync(lesson => lesson.Id == id);
        lesson.Title = title;
        lesson.ProjectName = projectName;
        lesson.DepartmentId = departmentId;
        lesson.FunctionId = functionId;
        lesson.IndustryId = industryId;
        lesson.ValueProposition = valueProposition;
        lesson.Description = description;
        lesson.ImageUrl = imageUrl;
        lesson.PersonToContact = personToContact;
        lesson.ModifiedDate = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return lesson.Id;
    }

    public async Task<Guid?> deleteLesson(Guid id)
    {
        var lesson = await _context.Lesson.FirstOrDefaultAsync(lesson => lesson.Id == id);
        _context.Lesson.Remove(lesson);
        await _context.SaveChangesAsync();
        return lesson.Id;
    }
}
