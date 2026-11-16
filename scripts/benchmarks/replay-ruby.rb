#!/usr/bin/env ruby
# frozen_string_literal: true

# Transliteration replay (ruby leg): execute every row of a jsonl
# row set ({map, src, out}) through the engine, in-process. One
# unmeasured warmup pass, then RUNS measured passes; only the
# transliteration loop is timed. Reports rows/sec and the exact-match
# count for verification.
#
# Usage: ruby -I<RUBY_LIB> replay-ruby.rb <maps_dir> <libs_dir> <rows.jsonl>

maps_dir, libs_dir, rows_path = ARGV[0], ARGV[1], ARGV[2]
RUNS = 3

require "interscript"
require "json"

rows = File.readlines(rows_path).filter_map do |l|
  l.strip!
  l.empty? ? nil : JSON.parse(l)
end
abort "no rows in #{rows_path}" if rows.empty?

Interscript.load_path.unshift(maps_dir) if File.directory?(maps_dir)
Interscript.load_path.unshift(libs_dir) if File.directory?(libs_dir)

# Setup (unmeasured): load each distinct map once.
interpreters = {}
rows.each do |row|
  next if interpreters.key?(row["map"])
  interpreters[row["map"]] = Interscript::Interpreter.call(row["map"])
end

# Unmeasured warmup pass (lazy loads settle on the first full pass).
rows.each do |row|
  begin
    interpreters[row["map"]].call(row["src"], :main)
  rescue StandardError
    # unexecutable rows are simply non-matching
  end
end

RUNS.times do
  matched = 0
  errors = 0
  t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  rows.each do |row|
    begin
      out = interpreters[row["map"]].call(row["src"], :main)
    rescue StandardError
      errors += 1
      next
    end
    matched += 1 if out == row["out"]
  end
  t1 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
  ms = (t1 - t0) * 1000
  puts format(
    "ruby replay %d/%d rows in %.1f ms (%.0f rows/s)",
    matched, rows.size, ms, rows.size / (ms / 1000.0),
  )
  divergent = rows.size - matched - errors
  warn "divergent #{divergent} exec_errors #{errors}" if divergent.positive? || errors.positive?
end
